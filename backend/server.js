const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markev';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Charger Schema
const chargerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ['AC', 'DC', 'Fast', 'Slow'], required: true },
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  price: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  connectorType: { type: String, default: 'Type 2' }
});

const Charger = mongoose.model('Charger', chargerSchema);

// Routes
app.get('/api/chargers/nearby', async (req, res) => {
  try {
    const { northEastLat, northEastLng, southWestLat, southWestLng } = req.query;
    
    if (!northEastLat || !northEastLng || !southWestLat || !southWestLng) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const chargers = await Charger.find({
      latitude: { 
        $gte: parseFloat(southWestLat), 
        $lte: parseFloat(northEastLat) 
      },
      longitude: { 
        $gte: parseFloat(southWestLng), 
        $lte: parseFloat(northEastLng) 
      }
    });
    
    // Transform data to match Android expectations
    const transformedChargers = chargers.map(charger => ({
      id: charger._id.toString(),
      name: charger.name,
      lat: charger.latitude,
      lng: charger.longitude,
      address: charger.address,
      type: charger.type,
      status: charger.status,
      price: charger.price,
      rating: charger.rating,
      connector_type: charger.connectorType
    }));
    
    res.json(transformedChargers);
  } catch (error) {
    console.error('Error fetching chargers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chargers/all', async (req, res) => {
  try {
    // Try to get from database first
    const chargers = await Charger.find();
    
    if (chargers.length > 0) {
      // Return database data
      const transformedChargers = chargers.map(charger => ({
        id: charger._id.toString(),
        name: charger.name,
        lat: charger.latitude,
        lng: charger.longitude,
        address: charger.address,
        type: charger.type,
        status: charger.status,
        price: charger.price,
        rating: charger.rating,
        connector_type: charger.connectorType
      }));
      res.json(transformedChargers);
    } else {
      // Return mock data if database is empty
      const mockChargers = [
        {
          id: "1",
          name: "Tesla Supercharger",
          lat: 23.0225,
          lng: 72.5714,
          address: "CG Road, Ahmedabad",
          type: "DC Fast",
          status: "available",
          price: 15.0,
          rating: 4.5,
          connector_type: "CCS"
        },
        {
          id: "2",
          name: "ChargePoint Station",
          lat: 23.0250,
          lng: 72.5750,
          address: "Law Garden, Ahmedabad",
          type: "AC Level 2",
          status: "available",
          price: 12.0,
          rating: 4.2,
          connector_type: "Type 2"
        },
        {
          id: "3",
          name: "EV Station",
          lat: 23.0300,
          lng: 72.5800,
          address: "Maninagar, Ahmedabad",
          type: "DC Fast",
          status: "busy",
          price: 18.0,
          rating: 4.7,
          connector_type: "CHAdeMO"
        }
      ];
      res.json(mockChargers);
    }
  } catch (error) {
    console.error('Error fetching all chargers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed data endpoint (for testing)
app.post('/api/chargers/seed', async (req, res) => {
  try {
    // Clear existing data
    await Charger.deleteMany({});
    
    // Sample charger data for Ahmedabad, India
    const sampleChargers = [
      {
        name: 'Tata Power EV Station - CG Road',
        latitude: 23.0225,
        longitude: 72.5714,
        address: 'CG Road, Ahmedabad',
        type: 'DC',
        status: 'available',
        price: 15.0,
        rating: 4.5,
        connectorType: 'CCS'
      },
      {
        name: 'ChargePoint - Law Garden',
        latitude: 23.0300,
        longitude: 72.5800,
        address: 'Law Garden, Ahmedabad',
        type: 'AC',
        status: 'available',
        price: 12.0,
        rating: 4.2,
        connectorType: 'Type 2'
      },
      {
        name: 'EV Station - Maninagar',
        latitude: 23.0100,
        longitude: 72.5900,
        address: 'Maninagar, Ahmedabad',
        type: 'Fast',
        status: 'busy',
        price: 18.0,
        rating: 4.7,
        connectorType: 'CHAdeMO'
      },
      {
        name: 'Green Charging Hub - Vastrapur',
        latitude: 23.0400,
        longitude: 72.5600,
        address: 'Vastrapur Lake, Ahmedabad',
        type: 'DC',
        status: 'available',
        price: 16.0,
        rating: 4.3,
        connectorType: 'CCS'
      },
      {
        name: 'EV Point - Satellite',
        latitude: 23.0500,
        longitude: 72.5500,
        address: 'Satellite, Ahmedabad',
        type: 'AC',
        status: 'offline',
        price: 10.0,
        rating: 3.8,
        connectorType: 'Type 2'
      }
    ];
    
    await Charger.insertMany(sampleChargers);
    res.json({ message: 'Sample chargers seeded successfully', count: sampleChargers.length });
  } catch (error) {
    console.error('Error seeding chargers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('MarkEv backend up');
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MarkEv Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});