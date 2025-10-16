require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markev';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = 'test@example.com';
  const password = '123456';
  const hashed = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User exists, updating password hash...');
    existing.password = hashed;
    await existing.save();
  } else {
    const u = new User({ email, password: hashed, role: 'user' });
    await u.save();
    console.log('Inserted test user:', email);
  }
  mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
