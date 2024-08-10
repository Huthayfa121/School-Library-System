const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huthayfashaheen:SIGMASH2003@sls.bamewgg.mongodb.net/SLS';
const client = new MongoClient(uri);

async function getUserByEmail(email) {
    try {
        await client.connect();
        const db = client.db('SLS'); 
        const usersCollection = db.collection('Users'); 

        const user = await usersCollection.findOne({ email: email });

        if (user) {

            return user;
        } else {
            console.log('No user found with the provided email.');
            return null;
        }
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    } finally {
        await client.close();
    }
}
async function createCollections() {
    try {
        await client.connect();
        const db = client.db('SLS'); 

        const usersCollection = db.collection('Users');
        await usersCollection.insertMany([
            {
                name: 'Alice Smith',
                email: 'alice.smith@example.com',
                password: 'hashed_password_1',
                role: 'member',
                dateJoined: new Date(),
                borrowedBooks: [],
                fines: 0
            },
            {
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                password: 'hashed_password_2',
                role: 'member',
                dateJoined: new Date(),
                borrowedBooks: [],
                fines: 0
            }
        ]);

        const booksCollection = db.collection('Books');
        await booksCollection.insertMany([
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '9780060935467',
                category: 'Fiction',
                publishedYear: 1960,
                copiesAvailable: 5,
                totalCopies: 5,
                borrowedBy: []
            },
            {
                title: '1984',
                author: 'George Orwell',
                isbn: '9780451524935',
                category: 'Dystopian',
                publishedYear: 1949,
                copiesAvailable: 3,
                totalCopies: 3,
                borrowedBy: []
            }
        ]);

        const borrowingRecordsCollection = db.collection('BorrowingRecords');
        await borrowingRecordsCollection.insertMany([
            {
                userId: 'some_user_id',
                bookId: 'some_book_id',
                borrowDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
                returnDate: null,
                status: 'borrowed'
            }
        ]);


        const categoriesCollection = db.collection('Categories');
        await categoriesCollection.insertMany([
            {
                name: 'Fiction',
                description: 'Fictional books'
            },
            {
                name: 'Dystopian',
                description: 'Dystopian novels'
            }
        ]);


        const finesCollection = db.collection('Fines');
        await finesCollection.insertMany([
            {
                userId: 'some_user_id',
                bookId: 'some_book_id',
                amount: 5,
                status: 'unpaid'
            }
        ]);


        const reservationsCollection = db.collection('Reservations');
        await reservationsCollection.insertMany([
            {
                userId: 'some_user_id',
                bookId: 'some_book_id',
                reservationDate: new Date(),
                status: 'active'
            }
        ]);

        console.log('Collections created and sample data inserted.');
    } catch (error) {
        console.error('Error creating collections and inserting data:', error);
    } finally {
        await client.close();
    }
}
module.exports = { getUserByEmail };
