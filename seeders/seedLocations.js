const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const DeliveryLocation = require('../models/DeliveryLocationModel');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB Connected for seeding...');
    await DeliveryLocation.deleteMany({});
    console.log('Old locations cleared.');

    const locations = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'locations.json'), 'utf-8')
    );

    await DeliveryLocation.insertMany(locations);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedDB();