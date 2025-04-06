const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const cors = require('cors');

// Enable CORS
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Peter@25',
    database: 'dbms'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { firstName, middleName, lastName, email, password, phone, sex, dob, address, postalCode, city, state } = req.body;

    console.log('Signup data received:', req.body); // Debugging

    const query = `
        INSERT INTO customers (FName, MName, LName, Email, Password, PhoneNo, Sex, DOB, Address, Postal_Code, City, State)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, middleName, lastName, email, password, phone, sex, dob, address, postalCode, city, state];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error signing up' });
        }
        console.log('User inserted successfully:', result); // Debugging
        res.status(201).json({ message: 'User signed up successfully' });
    });
});

//Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt with email:', email); // Debugging

    const query = 'SELECT * FROM customers WHERE Email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            console.log('No user found with this email'); // Debugging
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        console.log('User found:', user); // Debugging

        // Compare plain text passwords
        if (password !== user.Password) {
            console.log('Password mismatch'); // Debugging
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.User_ID,
                firstName: user.FName,
                middleName: user.MName,
                lastName: user.LName,
                email: user.Email,
                phone: user.PhoneNo,
                sex: user.Sex,
                dob: user.DOB,
                address: user.Address,
                postalCode: user.Postal_Code,
                city: user.City,
                state: user.State
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Endpoint to get user info
app.get('/user-info', (req, res) => {
    // Replace this with actual logic to fetch user info from the database
    const userInfo = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'Customer'
    };

    res.status(200).json(userInfo);
});

// Endpoint to fetch all products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to add a new product
app.post('/products', (req, res) => {
    const { name, description, price, stock, category, brand, sku, discount } = req.body;

    const query = `
        INSERT INTO products (ProductName, Description, Price, Instock, Category, Brand, SKU_Code, Discount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, description, price, stock, category, brand, sku, discount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ message: 'Error adding product' });
        }
        res.status(201).json({ message: 'Product added successfully' });
    });
});

// Endpoint to fetch reviews for a specific product
app.get('/products/:id/reviews', (req, res) => {
    const productId = req.params.id;

    const query = `
        SELECT r.Review_ID, r.User_ID, r.Rating, r.Comment, r.Review_Date, c.FName AS Reviewer_Name
        FROM reviews r
        JOIN customers c ON r.User_ID = c.User_ID
        WHERE r.Product_ID = ?
    `;
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ message: 'Error fetching reviews' });
        }
        res.status(200).json(results);
    });
});

app.get('/user/:id/reviews', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT r.Review_ID, r.Product_ID, r.Rating, r.Comment, r.Review_Date, p.ProductName
        FROM reviews r
        JOIN products p ON r.Product_ID = p.Product_ID
        WHERE r.User_ID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user reviews:', err);
            return res.status(500).json({ message: 'Error fetching user reviews' });
        }
        res.status(200).json(results);
    });
});

app.post('/reviews', (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the product exists
    const productCheckQuery = 'SELECT * FROM products WHERE Product_ID = ?';
    db.query(productCheckQuery, [productId], (err, results) => {
        if (err) {
            console.error('Error checking product:', err);
            return res.status(500).json({ message: 'Error checking product' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

        // Insert the review
        const insertQuery = `
            INSERT INTO reviews (User_ID, Product_ID, Rating, Comment, Review_Date)
            VALUES (?, ?, ?, ?, CURDATE())
        `;
        db.query(insertQuery, [userId, productId, rating, comment], (err, result) => {
            if (err) {
                console.error('Error adding review:', err);
                return res.status(500).json({ message: 'Error adding review' });
            }
            res.status(201).json({ message: 'Review added successfully' });
        });
    });
});

