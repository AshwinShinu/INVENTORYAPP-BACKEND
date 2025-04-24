const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Schema Definition
const RoomSchema = new mongoose.Schema({
    name: String,
    hostel: String,
    roomNo: Number
});

const PanCardSchema = new mongoose.Schema({
    name: String,
    panNumber: String,
    dob: String
});

// Model Definition
const RoomModel = mongoose.model("Room", RoomSchema, "Room");
const PanCardModel = mongoose.model("PanCard", PanCardSchema, "PanCard");

// Database Connection
mongoose.connect('mongodb+srv://ashwinshinu:ashwin@cluster0.mongodb.net/inventory?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

// RESTful APIs

// Create PAN Card
app.post('/addPanCard', async (req, res) => {
    try {
        await PanCardModel.create(req.body);
        res.json({ message: 'PAN Card Added Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read All PAN Cards
app.get('/viewPanCards', async (req, res) => {
    try {
        const records = await PanCardModel.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read PAN Card By ID
app.get('/findPanCard/:id', async (req, res) => {
    try {
        const record = await PanCardModel.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'PAN Card not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update PAN Card
app.put('/editPanCard/:id', async (req, res) => {
    try {
        const updatedPanCard = await PanCardModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPanCard) {
            return res.status(404).json({ message: 'PAN Card not found' });
        }
        res.json({ message: 'PAN Card Updated Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete PAN Card
app.delete('/deletePanCard/:id', async (req, res) => {
    try {
        const deletedItem = await PanCardModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'PAN Card not found' });
        }
        res.json({ message: 'PAN Card Deleted Successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
