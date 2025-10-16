const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data
const chargers = [
    { id: "1", name: "Tesla Supercharger", lat: 23.0225, lng: 72.5714, address: "Ahmedabad", type: "DC Fast", status: "available" },
    { id: "2", name: "ChargePoint", lat: 23.0250, lng: 72.5750, address: "Ahmedabad", type: "AC", status: "available" },
    { id: "3", name: "EV Station", lat: 23.0300, lng: 72.5800, address: "Ahmedabad", type: "DC Fast", status: "busy" }
];

// Routes
app.get('/', (req, res) => {
    res.send('MarkEv Backend Working!');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/chargers/all', (req, res) => {
    res.json(chargers);
});

app.get('/api/chargers/nearby', (req, res) => {
    res.json(chargers);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
