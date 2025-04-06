document.addEventListener('DOMContentLoaded', () => {
    // Logic for login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from refreshing the page

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Login form submitted'); // Debugging
            console.log('Email:', email); // Debugging
            console.log('Password:', password); // Debugging

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                console.log('Response received:', response); // Debugging

                const result = await response.json();
                console.log('Result:', result); // Debugging

                if (response.ok) {
                    alert(result.message); // Show success message
                    localStorage.setItem('user', JSON.stringify(result.user)); // Store user info
                    window.location.href = 'home.html'; // Redirect to home page
                } else {
                    alert(result.message); // Show error message
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Logic for signup page
    const signupForm = document.getElementById('signupForm');
    console.log('Signup form:', signupForm); // Debugging

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from refreshing the page
            console.log('Form submission prevented'); // Debugging

            const firstName = document.getElementById('firstName').value;
            const middleName = document.getElementById('middleName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            const sex = document.getElementById('sex').value;
            const dob = document.getElementById('dob').value;
            const address = document.getElementById('address').value;
            const postalCode = document.getElementById('postalCode').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;

            console.log('Form submitted with data:', {
                firstName,
                middleName,
                lastName,
                email,
                password,
                phone,
                sex,
                dob,
                address,
                postalCode,
                city,
                state
            }); // Debugging

            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        middleName,
                        lastName,
                        email,
                        password,
                        phone,
                        sex,
                        dob,
                        address,
                        postalCode,
                        city,
                        state
                    }),
                });

                console.log('Response received:', response); // Debugging

                const result = await response.json();
                console.log('Result:', result); // Debugging

                if (response.ok) {
                    alert(result.message);
                    window.location.href = 'login.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error during signup:', error);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.error('Signup form not found'); // Debugging
    }
});

// Logic for home page
const userInfoDiv = document.getElementById('user-info');
if (userInfoDiv) {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
    if (user) {
        userInfoDiv.innerHTML = `
            <h2>Welcome, ${user.firstName} ${user.lastName}!</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Sex:</strong> ${user.sex}</p>
            <p><strong>Date of Birth:</strong> ${user.dob}</p>
            <p><strong>Address:</strong> ${user.address}, ${user.city}, ${user.state}, ${user.postalCode}</p>
        `;
    } else {
        userInfoDiv.innerHTML = '<p>No user information available. Please log in.</p>';
    }
}


// Logout logic
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user'); // Clear user info from localStorage
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display products
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            const products = await response.json();

            const productTableBody = document.getElementById('products');
            productTableBody.innerHTML = ''; // Clear existing rows

            products.forEach(product => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${product.Product_ID}</td>
                    <td>${product.ProductName}</td>
                    <td>${product.Description}</td>
                    <td>${product.Price}</td>
                    <td>${product.Instock}</td>
                    <td>${product.Category}</td>
                    <td>${product.Brand}</td>
                    <td>${product.SKU_Code}</td>
                    <td>${product.Discount}</td>
                `;

                productTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Initial fetch of products
    fetchProducts();
});