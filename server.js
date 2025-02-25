// server.js - This would run on your server, not in the browser
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS for browser requests
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bhoomikm12',
  database: 'carbooking'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Helper function to generate a booking ID
function generateBookingId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API endpoint to create a new booking
app.post('/api/bookings', (req, res) => {
  const { customerName, carName, location, email, phone, driverLicense, paymentMethod } = req.body;
  const bookingId = generateBookingId();

  const sql = `INSERT INTO customer (Booking_ID, Customer_name, Car_name, Location, Email, Phone, Driver_License, Payment_Method)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const data = [bookingId, customerName, carName, location, email, phone, driverLicense, paymentMethod];

  connection.query(sql, data, (err, result) => {
    if (err) {
      console.error('Error inserting booking:', err);
      return res.status(500).json({ error: 'Failed to save booking' });
    }
    
    console.log('Booking inserted successfully:', result);
    res.status(201).json({ 
      success: true, 
      bookingId: bookingId,
      message: 'Booking saved successfully!' 
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle application shutdown
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});