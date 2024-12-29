const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3020;



const app = express();

app.get('/',(req,res)=>{
  res.sendFile(path,join(__dirname,'signup.html'))
})
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connection successful');
});

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  User_name: String,
  email: String,
  password: String,
});

const Users = mongoose.model('data', userSchema);

// Routes

app.post('/post', async (req, res) => {
  try {
    const { number } = req.body;
    const user = new Users({
      number:Int
    });

    await user.save();
    console.log('User saved:', user);

    // Send a response to the client
    res.status(200).send('User registered successfully!');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
