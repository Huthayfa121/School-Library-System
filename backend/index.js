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

app.post('/ForgotPassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    await db.collection('Users').updateOne(
      { email },
      { $set: { password: newPassword } }
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/Users', async (req, res) => {
    const page = parseInt(req.query.p) || 0;
  
    try {
      const users = await db.collection('Users')
        .find({})
        .toArray();
  
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  


app.post('/BorrowBook', async (req, res) => {
  const { userId, bookId } = req.body;
  const borrowPeriod = 7 * 24 * 60 * 60 * 1000; 

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid user or book ID' });
  }

  try {
    const book = await db.collection('Books').findOne({ _id: new ObjectId(bookId) });
    const user = await db.collection('Users').findOne({ _id: new ObjectId(userId) });

    if (!book || !user) {
      return res.status(404).json({ message: 'Book or User not found' });
    }

    if (book.copiesAvailable <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    await db.collection('Books').updateOne(
      { _id: new ObjectId(bookId) },
      { $inc: { copiesAvailable: -1 } }
    );

    const dueDate = new Date(Date.now() + borrowPeriod);
    console.log(dueDate)
   
    await db.collection('Users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { borrowedBooks: { bookId: new ObjectId(bookId), dueDate } },
        $set: {fine: user.fine + book.price}
        
      }
    );

    res.status(200).json({ message: 'Book borrowed successfully', dueDate });
  } catch (err) {
    console.error('Error borrowing book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

  
app.post('/ReturnBook', async (req, res) => {
  const { userId, bookId } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid user or book ID' });
  }

  try {
    const user = await db.collection('Users').findOne({ _id: new ObjectId(userId) });
    const book = await db.collection('Books').findOne({ _id: new ObjectId(bookId) });

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found' });
    }

    const borrowedBook = user.borrowedBooks.find(b => b.bookId.toString() === bookId);
    
    if (!borrowedBook) {
      return res.status(400).json({ message: 'This book is not borrowed by the user' });
    }

    const currentDate = new Date();
    const dueDate = new Date(borrowedBook.dueDate);
    let updatedFine = user.fine;

    if (currentDate > dueDate) {
      const lateDays = Math.ceil((currentDate - dueDate) / (24 * 60 * 60 * 1000));
      const fineForLateReturn = lateDays * (book.price * 0.1);
      updatedFine += fineForLateReturn;
    } else {
      updatedFine -= book.price 
    }

    await db.collection('Users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { borrowedBooks: { bookId: new ObjectId(bookId), dueDate } }, 
        $set: { fine: updatedFine } 
      }
    );

    await db.collection('Books').updateOne(
      { _id: new ObjectId(bookId) },
      { $inc: { copiesAvailable: 1 } }
    );

    res.status(200).json({ message: 'Book returned successfully', fine: updatedFine });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/Books', (req, res) => {
  
  const page = req.query.p || 0
  const bpp = 3
  
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = password === user.password;

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Sign-in successful',
      role: user.role,
      name: user.name,
      fine: user.fine,
      userId: user._id, 
    });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/Users/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
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