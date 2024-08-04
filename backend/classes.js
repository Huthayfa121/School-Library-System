const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://huthayfashaheen:SIGMASH2003@sls.bamewgg.mongodb.net/?retryWrites=true&w=majority&appName=SLS';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createCollections() {
    try {
        await client.connect();
        const db = client.db('SLS'); // Create or access the database

        // Users Collection
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

        // Books Collection
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

        // Borrowing Records Collection
        const borrowingRecordsCollection = db.collection('BorrowingRecords');
        await borrowingRecordsCollection.insertMany([
            {
                userId: 'some_user_id',
                bookId: 'some_book_id',
                borrowDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                returnDate: null,
                status: 'borrowed'
            }
        ]);

        // Categories Collection
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

        // Fines Collection
        const finesCollection = db.collection('Fines');
        await finesCollection.insertMany([
            {
                userId: 'some_user_id',
                bookId: 'some_book_id',
                amount: 5,
                status: 'unpaid'
            }
        ]);

        // Reservations Collection (Optional)
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

createCollections();
