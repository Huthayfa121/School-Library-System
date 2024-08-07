const express = require('express');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb} = require('./db')
const bodyParser = require('body-parser');
const cors = require('cors');  
const app = express()
const { getUserByEmail } = require('./classes');
const nodemailer = require('nodemailer');


app.use(cors()); 
app.use(express.json())
app.use(bodyParser.json());

let db

connectToDb((err) => {
    if (err) {
        console.error('Failed to connect to the database');
    } else {
        console.log('Successfully connected to the database');
        app.listen(3002, () => {
            console.log('Server is running on port 3002');
        });
        db = getDb();
    }
});

app.get('/Users', async (req, res) => {
    const page = parseInt(req.query.p) || 0;
    const pageSize = 10; // Number of users per page
  
    try {
      const users = await db.collection('Users')
        .find({})
        .skip(page * pageSize)
        .limit(pageSize)
        .toArray();
  
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.get('/Books', (req, res) => {
  
  const page = req.query.p || 0
  const bpp = 2
  
    let books = []

    db.collection('Books')
      .find()
      .sort({author: 1})
      .skip(page * bpp)
      .limit(bpp)
      .forEach(book => books.push(book))
      .then(() => {
        res.status(200).json(books)
        })
      .catch (() => {
        res.status(500).json({message: 'Error fetching books'})
      })

})

app.post('/Signup', async (req, res) => {
    require('dotenv').config();

  const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
    },
  });
    const { name, email, password, confirmPassword} = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await db.collection('Users').findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const newUser = {
            name,
            email,
            password,
            role: 'member', 
            dateJoined: new Date(),
            borrowedBooks: [], 
            fine: 0
        };

        const result = await db.collection('Users').insertOne(newUser);
              console.log(newUser)

        // Optional: Send a welcome email (ensure transporter is defined elsewhere in your code)
        const mailOptions = {
            from: 'huthayfas999@gmail.com',
            to: email,
            subject: 'Welcome to Our Service',
            text: 'Thank you for signing up!',
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Respond with success message
        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertedId,
        });
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/Signin', async (req, res) => {
    console.log('Request body:', req.body); 
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await getUserByEmail(email)

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = password === user.password;
        console.log(match);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({
            message: 'Sign-in successful',
        });
    } catch (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/Books/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
            })
        .catch(err => {
            res.status(500).json({message: 'Error fetching book'})
        })
    } else {
        res.status(500).json({message: 'Invalid book id'})
    }

})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('Books')
      .insertOne(book)
      .then(result => {
        res.status(201).json(result)
      })
      .catch(err => {
        res.status(201).json({err:"couldnt create new document"})
      })
})

app.delete('/Books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
            })
        .catch(err => {
            res.status(500).json({message: 'Couldnt delete the document'})
        })
    } else {
        res.status(500).json({message: 'Invalid book id'})
    }
})

app.patch('/Books/:id' , (req, res) => {
    const update = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('Books')
        .updateOne({_id: new ObjectId(req.params.id)} , {$set: update})
        .then(result => {
            res.status(200).json(result)
            })
        .catch(err => {
            res.status(500).json({message: 'Couldnt update the document'})
        })
    } else {
        res.status(500).json({message: 'Invalid book id'})
    }
})