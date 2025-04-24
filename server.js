const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Database Connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ashwinshinu:ashwinshinu@cluster0.yhzhn.mongodb.net/inventory";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// Database Connection
mongoose.connect('mongodb+srv://stanlykurian:stanlykurian@cluster0.txphiw3.mongodb.net/DemoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Atlas Connection Error:', err));

// Room Schema and Model
const RoomSchema = new mongoose.Schema({
    studentName: String,
    hostel: String,
    roomNumber: String,
    createdBy: String
}, {
    indexes: [{ key: { roomNumber: 1, createdBy: 1 }, unique: true }]
});
const RoomModel = mongoose.model('Room', RoomSchema, 'Room');

// PAN Card Schema and Model
const PanCardSchema = new mongoose.Schema({
    name: String,
    panNumber: String,
    dob: String,
    createdBy: String
}, {
    indexes: [{ key: { panNumber: 1, createdBy: 1 }, unique: true }]
});
const PanCardModel = mongoose.model('PanCard', PanCardSchema, 'PanCard');

// Default Route
app.get('/', (req, res) => {
    res.send('Hostel Management Server is running...');
});

// Room CRUD Routes
app.get('/viewRooms', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }
        const rooms = await RoomModel.find({ createdBy: userEmail });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

app.post('/addRoom', async (req, res) => {
    try {
        const { studentName, hostel, roomNumber, createdBy } = req.body;
        if (!createdBy) {
            return res.status(400).json({ error: 'User email is required' });
        }
        if (!studentName || !hostel || !roomNumber) {
            return res.status(400).json({ error: 'All room fields are required' });
        }
        const newRoom = new RoomModel({ studentName, hostel, roomNumber, createdBy });
        await newRoom.save();
        res.json({ success: true, message: 'Room added successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Room number already exists for this user' });
        } else {
            res.status(500).json({ error: 'Failed to add room' });
        }
    }
});

app.get('/findRoom/:id', async (req, res) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

app.put('/editRoom/:id', async (req, res) => {
    try {
        const { studentName, hostel, roomNumber, createdBy } = req.body;
        const updatedRoom = await RoomModel.findByIdAndUpdate(
            req.params.id,
            { studentName, hostel, roomNumber, createdBy },
            { new: true }
        );
        if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });
        res.json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room' });
    }
});

app.delete('/deleteRoom/:id', async (req, res) => {
    try {
        const deletedRoom = await RoomModel.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: 'Room not found' });
        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

// PAN Card CRUD Routes
app.get('/viewPanCards', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }
        const panCards = await PanCardModel.find({ createdBy: userEmail });
        res.json(panCards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PAN cards' });
    }
});

app.post('/addPanCard', async (req, res) => {
    try {
        const { name, panNumber, dob, createdBy } = req.body;
        if (!createdBy) {
            return res.status(400).json({ error: 'User email is required' });
        }
        if (!name || !panNumber || !dob) {
            return res.status(400).json({ error: 'All PAN card fields are required' });
        }
        const newPanCard = new PanCardModel({ name, panNumber, dob, createdBy });
        await newPanCard.save();
        res.json({ success: true, message: 'PAN Card added successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'PAN number already exists for this user' });
        } else {
            res.status(500).json({ error: 'Failed to add PAN card' });
        }
    }
});

app.get('/findPanCard/:id', async (req, res) => {
    try {
        const panCard = await PanCardModel.findById(req.params.id);
        if (!panCard) return res.status(404).json({ message: 'PAN Card not found' });
        res.json(panCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PAN card' });
    }
});

app.put('/editPanCard/:id', async (req, res) => {
    try {
        const { name, panNumber, dob, createdBy } = req.body;
        const updatedPanCard = await PanCardModel.findByIdAndUpdate(
            req.params.id,
            { name, panNumber, dob, createdBy },
            { new: true }
        );
        if (!updatedPanCard) return res.status(404).json({ message: 'PAN Card not found' });
        res.json({ success: true, message: 'PAN Card updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update PAN card' });
    }
});

app.delete('/deletePanCard/:id', async (req, res) => {
    try {
        const deletedPanCard = await PanCardModel.findByIdAndDelete(req.params.id);
        if (!deletedPanCard) return res.status(404).json({ message: 'PAN Card not found' });
        res.json({ success: true, message: 'PAN Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete PAN card' });
    }
});

// User Routes (Signup and Login)
app.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, location, password } = req.body;
        if (!name || !email || !phone || !location || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (isNaN(phone)) {
            return res.status(400).json({ success: false, message: 'Phone must be a number' });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const newUser = new UserModel({ name, email, phone: Number(phone), location, password });
        await newUser.save();
        res.json({ success: true, message: 'User registered successfully', user: { name, email } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to register user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }
        res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to login' });
    }
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});