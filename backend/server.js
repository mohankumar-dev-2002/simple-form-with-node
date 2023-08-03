const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simple-form-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for your form data
const formDataSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: String,
    email: String,
    password: String,
    qualification: String,
    profession: String,
});

const FormDataModel = mongoose.model('FormData', formDataSchema);

// Serve the React app at the home route
app.use(express.static('client/build')); // Assuming your React build files are in a "client/build" directory

// Handle data from the form's "Finish" button
app.post('/submit', async (req, res) => {
    const formData = req.body;

    try {
        // Save the form data to the MongoDB database
        const newFormData = new FormDataModel(formData);
        await newFormData.save();

        console.log('Data saved to MongoDB:', newFormData);
        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to the database');
    }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
