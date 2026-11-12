const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blood_vault');

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const hospitals = ['AIIMS', 'Apollo', 'Fortis', 'Max Hospital', 'Medanta'];

const Donor = mongoose.model('Donor', new mongoose.Schema({
  fullName: String,
  bloodType: String,
  phone: String,
  address: String,
  totalDonations: Number,
  isEligible: Boolean
}));

const Recipient = mongoose.model('Recipient', new mongoose.Schema({
  fullName: String,
  bloodType: String,
  phone: String,
  hospital: String,
  age: Number,
  hemoglobinLevel: Number,
  systolicBP: Number,
  diastolicBP: Number,
  heartRate: Number,
  predictedPriority: Number,
  status: String
}));

const Blood = mongoose.model('Blood', new mongoose.Schema({
  bloodType: String,
  component: String,
  bagNumber: String,
  volume: Number
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  bloodType: String,
  component: String,
  unitsRequested: Number,
  urgency: String,
  status: String
}));

const names = [
  "Amit Sharma","Rahul Verma","Priya Singh","Neha Gupta","Rohit Kumar",
  "Anjali Mehta","Vikas Yadav","Pooja Sharma","Arjun Patel","Sneha Joshi"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await Donor.deleteMany();
  await Recipient.deleteMany();
  await Blood.deleteMany();
  await Order.deleteMany();

  const donors = [];
  const recipients = [];
  const bloodUnits = [];
  const orders = [];

  // 🔴 100 DONORS
  for (let i = 1; i <= 100; i++) {
    donors.push({
      fullName: `${random(names)} ${i}`,
      bloodType: random(bloodTypes),
      phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `City Area ${i}`,
      totalDonations: Math.floor(Math.random() * 10),
      isEligible: Math.random() > 0.2
    });
  }

  // 🔵 100 RECIPIENTS
  for (let i = 1; i <= 100; i++) {
    recipients.push({
      fullName: `${random(names)} Patient ${i}`,
      bloodType: random(bloodTypes),
      phone: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
      hospital: random(hospitals),
      age: Math.floor(Math.random() * 60) + 18,
      hemoglobinLevel: +(Math.random() * 6 + 5).toFixed(1),
      systolicBP: Math.floor(Math.random() * 40) + 90,
      diastolicBP: Math.floor(Math.random() * 30) + 60,
      heartRate: Math.floor(Math.random() * 40) + 60,
      predictedPriority: Math.floor(Math.random() * 100),
      status: "pending"
    });
  }

  // 🩸 50 BLOOD UNITS
  for (let i = 1; i <= 50; i++) {
    bloodUnits.push({
      bloodType: random(bloodTypes),
      component: random(['Whole Blood', 'Plasma', 'Platelets']),
      bagNumber: `BG${Date.now()}${i}`,
      volume: 450
    });
  }

  // 📦 50 ORDERS
  for (let i = 1; i <= 50; i++) {
    orders.push({
      bloodType: random(bloodTypes),
      component: random(['Whole Blood', 'Plasma', 'Platelets']),
      unitsRequested: Math.floor(Math.random() * 3) + 1,
      urgency: random(['low','medium','high','critical']),
      status: "pending"
    });
  }

  await Donor.insertMany(donors);
  await Recipient.insertMany(recipients);
  await Blood.insertMany(bloodUnits);
  await Order.insertMany(orders);

  console.log("🔥 100 donors, 100 recipients, 50 blood units, 50 orders added!");
  mongoose.disconnect();
}

seed();