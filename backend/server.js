const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'carerent-demo-secret-change-me';

app.use(cors());
app.use(express.json());

let nextUserId = 1;
let nextRentalId = 1;
const users = [];
const rentals = [];

const equipment = [
  { id: 1, name: 'Semi Fowler Hospital Bed', category: 'Beds', pricePerDay: 650, available: true },
  { id: 2, name: 'Manual Hospital Bed', category: 'Beds', pricePerDay: 550, available: true },
  { id: 3, name: 'Wheelchair', category: 'Mobility', pricePerDay: 250, available: true },
  { id: 4, name: 'Oxygen Concentrator', category: 'Oxygen', pricePerDay: 450, available: true },
  { id: 5, name: 'Walker', category: 'Mobility', pricePerDay: 150, available: true }
];

const hospitals = [
  { id: 1, name: 'Bhima Hospital', city: 'Bhimavaram' },
  { id: 2, name: 'Sri Sai Hospital', city: 'Bhimavaram' },
  { id: 3, name: 'GVG Hospital', city: 'Bhimavaram' }
];

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Login required.' });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    address: user.address,
    role: user.role,
    businessName: user.businessName,
    equipmentType: user.equipmentType
  };
}

app.get('/', (req, res) => {
  res.json({ app: 'CareRent Backend', status: 'running', version: '1.1.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CareRent API' });
});

app.post('/api/register', async (req, res) => {
  const {
    name, mobile, email, address, password,
    role = 'patient', businessName = '', equipmentType = ''
  } = req.body || {};

  if (!name || !mobile || !email || !address || !password) {
    return res.status(400).json({ message: 'Name, mobile, email, address and password are required.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must contain at least 6 characters.' });
  }
  if (!['patient', 'owner'].includes(role)) {
    return res.status(400).json({ message: 'Role must be patient or owner.' });
  }
  if (role === 'owner' && !businessName) {
    return res.status(400).json({ message: 'Business name is required for an owner account.' });
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = {
    id: nextUserId++, name: String(name).trim(), mobile: String(mobile).trim(),
    email: String(email).trim().toLowerCase(), address: String(address).trim(),
    passwordHash: await bcrypt.hash(String(password), 10), role,
    businessName: String(businessName).trim(), equipmentType: String(equipmentType).trim()
  };
  users.push(user);
  res.status(201).json({ message: 'Account created successfully.', user: publicUser(user) });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === String(email || '').trim().toLowerCase());
  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ message: 'Login successful.', token, user: publicUser(user) });
});

app.get('/api/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(publicUser(user));
});

app.get('/api/equipment', (req, res) => {
  const category = String(req.query.category || '').trim().toLowerCase();
  const result = category ? equipment.filter(e => e.category.toLowerCase() === category) : equipment;
  res.json(result);
});

app.get('/api/equipment/:id', (req, res) => {
  const item = equipment.find(e => e.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Equipment not found.' });
  res.json(item);
});

app.get('/api/hospitals', (req, res) => res.json(hospitals));

app.post('/api/rentals', auth, (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Only patient accounts can rent equipment.' });
  }

  const { equipmentId, days, deliveryAddress, hospitalId = null } = req.body || {};
  const item = equipment.find(e => e.id === Number(equipmentId));
  const rentalDays = Number(days);

  if (!item) return res.status(404).json({ message: 'Equipment not found.' });
  if (!Number.isInteger(rentalDays) || rentalDays < 1) {
    return res.status(400).json({ message: 'Rental days must be a whole number greater than 0.' });
  }
  if (!deliveryAddress) return res.status(400).json({ message: 'Delivery address is required.' });
  if (hospitalId !== null && !hospitals.some(h => h.id === Number(hospitalId))) {
    return res.status(400).json({ message: 'Hospital not found.' });
  }

  const rentalCharge = item.pricePerDay * rentalDays;
  const deliveryCharge = 300;
  const otherCharges = 150;
  const rental = {
    id: nextRentalId++, orderNumber: `CR-${Date.now().toString().slice(-6)}`,
    userId: req.user.id, equipmentId: item.id, equipmentName: item.name,
    days: rentalDays, rentalCharge, deliveryCharge, otherCharges,
    total: rentalCharge + deliveryCharge + otherCharges,
    deliveryAddress: String(deliveryAddress).trim(),
    hospitalId: hospitalId === null ? null : Number(hospitalId),
    status: 'Confirmed', createdAt: new Date().toISOString()
  };
  rentals.push(rental);
  res.status(201).json(rental);
});

app.get('/api/rentals', auth, (req, res) => {
  res.json(rentals.filter(r => r.userId === req.user.id));
});

app.get('/api/rentals/:id', auth, (req, res) => {
  const rental = rentals.find(r => r.id === Number(req.params.id) && r.userId === req.user.id);
  if (!rental) return res.status(404).json({ message: 'Rental not found.' });
  res.json(rental);
});

app.patch('/api/rentals/:id/status', auth, (req, res) => {
  const rental = rentals.find(r => r.id === Number(req.params.id) && r.userId === req.user.id);
  const allowed = ['Confirmed', 'Out for Delivery', 'Delivered', 'Active', 'Pickup Requested', 'Completed'];
  if (!rental) return res.status(404).json({ message: 'Rental not found.' });
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ message: 'Invalid rental status.' });
  rental.status = req.body.status;
  res.json(rental);
});

app.listen(PORT, () => {
  console.log(`CareRent backend running at http://localhost:${PORT}`);
});
