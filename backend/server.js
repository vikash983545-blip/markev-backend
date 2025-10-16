const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vikash983545:vikash983545@cluster0.8qjqj.mongodb.net/markev?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Charger Schema
const chargerSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  type: String,
  status: String,
  price: Number,
  rating: Number,
  connector_type: String
});

const Charger = mongoose.model('Charger', chargerSchema);

app.use(cors());
app.use(express.json());

// Mock data for fallback
const mockChargers = [
    { id: "1", name: "Tesla Supercharger", lat: 23.0225, lng: 72.5714, address: "CG Road, Ahmedabad", type: "DC Fast", status: "available", price: 15.0, rating: 4.5, connector_type: "CCS" },
    { id: "2", name: "ChargePoint Station", lat: 23.0250, lng: 72.5750, address: "Law Garden, Ahmedabad", type: "AC Level 2", status: "available", price: 12.0, rating: 4.2, connector_type: "Type 2" },
    { id: "3", name: "EV Station", lat: 23.0300, lng: 72.5800, address: "Maninagar, Ahmedabad", type: "DC Fast", status: "busy", price: 18.0, rating: 4.7, connector_type: "CHAdeMO" }
];

// Routes
app.get('/', (req, res) => {
    res.send('MarkEv Backend Working!');
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend is running',
        database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB Atlas' : 'Disconnected'
    });
});

app.get('/api/chargers/all', async (req, res) => {
    try {
        const chargers = await Charger.find();
        if (chargers.length === 0) {
            // If no data in DB, return mock data
            res.json(mockChargers);
        } else {
            res.json(chargers);
        }
    } catch (error) {
        console.error('Error fetching chargers:', error);
        // Fallback to mock data on error
        res.json(mockChargers);
    }
});

app.get('/api/chargers/nearby', async (req, res) => {
    try {
        const { northEastLat, northEastLng, southWestLat, southWestLng } = req.query;
        
        const chargers = await Charger.find({
            lat: { $gte: parseFloat(southWestLat), $lte: parseFloat(northEastLat) },
            lng: { $gte: parseFloat(southWestLng), $lte: parseFloat(northEastLng) }
        });
        
        if (chargers.length === 0) {
            // Filter mock data based on bounds
            const filteredChargers = mockChargers.filter(charger => {
                return (
                    charger.lat <= parseFloat(northEastLat) &&
                    charger.lat >= parseFloat(southWestLat) &&
                    charger.lng <= parseFloat(northEastLng) &&
                    charger.lng >= parseFloat(southWestLng)
                );
            });
            res.json(filteredChargers);
        } else {
            res.json(chargers);
        }
    } catch (error) {
        console.error('Error fetching nearby chargers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Seed database with mock data
app.post('/api/chargers/seed', async (req, res) => {
    try {
        await Charger.deleteMany({}); // Clear existing data
        await Charger.insertMany(mockChargers);
        res.json({ message: 'Database seeded with mock data', count: mockChargers.length });
    } catch (error) {
        console.error('Error seeding database:', error);
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
