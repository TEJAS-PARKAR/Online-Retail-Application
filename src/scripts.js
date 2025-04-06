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
    // Toggle the add product form
    const toggleFormButton = document.getElementById('toggleFormButton');
    const addProductSection = document.getElementById('add-product');
    if (toggleFormButton) {
        toggleFormButton.addEventListener('click', () => {
            console.log('Toggle button clicked'); // Debugging
            if (addProductSection.style.display === 'none') {
                addProductSection.style.display = 'block';
            } else {
                addProductSection.style.display = 'none';
            }
        });
    }

    // Handle product form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Debugging

            const name = document.getElementById('productName').value;
            const description = document.getElementById('productDescription').value;
            const price = document.getElementById('productPrice').value;
            const stock = document.getElementById('productStock').value;
            const category = document.getElementById('productCategory').value;
            const brand = document.getElementById('productBrand').value;
            const sku = document.getElementById('productSKU').value;
            const discount = document.getElementById('productDiscount').value;

            try {
                const response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, description, price, stock, category, brand, sku, discount }),
                });

                const result = await response.json();
                alert(result.message);

                // Refresh the product list
                fetchProducts();

                // Clear the form and hide it
                productForm.reset();
                addProductSection.style.display = 'none';
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });
    }

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

// Fetch and display reviews for a specific product
async function fetchReviews(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}/reviews`);
        const reviews = await response.json();

        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = ''; // Clear existing reviews

        if (reviews.length === 0) {
            reviewsList.innerHTML = '<li>No reviews available for this product.</li>';
        } else {
            reviews.forEach(review => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${review.Reviewer_Name}</strong> (${review.Rating}/5):
                    <p>${review.Comment}</p>
                    <small>Reviewed on: ${review.Review_Date}</small>
                `;
                reviewsList.appendChild(li);
            });
        }

        // Show the modal
        const reviewsModal = document.getElementById('reviewsModal');
        reviewsModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Close the reviews modal
const closeModal = document.getElementById('closeModal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        const reviewsModal = document.getElementById('reviewsModal');
        reviewsModal.style.display = 'none';
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
                    <td><button class="reviewsButton" data-id="${product.Product_ID}">Reviews</button></td>
                `;

                productTableBody.appendChild(row);
            });

            // Add event listeners to all "Reviews" buttons
            const reviewButtons = document.querySelectorAll('.reviewsButton');
            reviewButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    fetchReviews(productId);
                });
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Fetch and display reviews for a specific product
    async function fetchReviews(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}/reviews`);
            const reviews = await response.json();
    
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = ''; // Clear existing reviews
    
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<li>No reviews available for this product.</li>';
            } else {
                reviews.forEach(review => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${review.Reviewer_Name}</strong> (${review.Rating}/5):
                        <p>${review.Comment}</p>
                        <small>Reviewed on: ${review.Review_Date}</small>
                    `;
                    reviewsList.appendChild(li);
                });
            }
    
            // Show the modal
            const reviewsModal = document.getElementById('reviewsModal');
            reviewsModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    
    }

    // Close the reviews modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const reviewsModal = document.getElementById('reviewsModal');
            reviewsModal.style.display = 'none';
        });
    }

    // Initial fetch of products
    fetchProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the logged-in user's ID from localStorage
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info
    const userId = user ? user.id : null; // Get the user ID or set it to null if not logged in

    if (!userId) {
        alert('You must be logged in to view or add reviews.');
        return;
    }

    // Fetch and display user reviews
    async function fetchUserReviews() {
        try {
            const response = await fetch(`http://localhost:3000/user/${userId}/reviews`);
            const reviews = await response.json();

            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = ''; // Clear existing reviews

            if (reviews.length === 0) {
                reviewsList.innerHTML = '<li>No reviews available.</li>';
            } else {
                reviews.forEach(review => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>Product:</strong> ${review.ProductName} <br>
                        <strong>Rating:</strong> ${review.Rating}/5 <br>
                        <strong>Comment:</strong> ${review.Comment} <br>
                        <small>Reviewed on: ${review.Review_Date}</small>
                    `;
                    reviewsList.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    }

    // Handle review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productId = document.getElementById('productId').value;
            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value;

            try {
                const response = await fetch('http://localhost:3000/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, productId, rating, comment }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    reviewForm.reset(); // Clear the form
                    fetchUserReviews(); // Refresh the reviews list
                    document.getElementById('add-review').style.display = 'none'; // Hide the form
                } else {
                    alert(result.message); // Show error message
                }
            } catch (error) {
                console.error('Error adding review:', error);
            }
        });
    }

    // Toggle review form visibility
    const addReviewButton = document.getElementById('addReviewButton');
    const addReviewSection = document.getElementById('add-review');
    if (addReviewButton) {
        addReviewButton.addEventListener('click', () => {
            if (addReviewSection.style.display === 'none') {
                addReviewSection.style.display = 'block';
            } else {
                addReviewSection.style.display = 'none';
            }
        });
    }

    // Initial fetch of user reviews
    fetchUserReviews();
});