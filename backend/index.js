const express = require('express');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb} = require('./db')
const bodyParser = require('body-parser');
const cors = require('cors');  // Import cors
const app = express()

app.use(cors());  // Use cors middleware
app.use(express.json())
app.use(bodyParser.json());



let db

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        })
        db = getDb()        
    }
})


app.get('/Books', (req, res) => {
  
  const page = req.query.p || 0
  const bpp = 2
  
    let books = []

    db.collection('Books')
      .find()
      .sort({author: 1})
      .skip(page * bpp)
      .limit(bpp)
      .forEach(book => books.push(book) )
      .then(() => {
        res.status(200).json(books)
        })
      .catch (() => {
        res.status(500).json({message: 'Error fetching books'})
      })

})

app.post('/Signin', async (req, res) => {
    console.log('Request body:', req.body); // Add this line to log the request payload
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const usersCollection = db.collection('Users');
        const user = await usersCollection.findOne({email:email});
        console.log(user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }


        res.status(200).json({
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




