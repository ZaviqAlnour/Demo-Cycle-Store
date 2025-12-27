// Main JavaScript for Cycle Store Demo

// Product data - in a real app this would come from an API
const products = [
    {
        id: 1,
        name: "Velocity X1 Mountain Bike",
        category: "Mountain Bike",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
        description: "A premium mountain bike designed for trail riding with advanced suspension and durable components.",
        frameMaterial: "Carbon fiber",
        wheelSize: 29,
        gears: 21,
        brakeType: "Hydraulic disc",
        terrain: "mountain",
        useCase: "off-road adventures"
    },
    {
        id: 2,
        name: "Aero Racer Pro Road Bike",
        category: "Road Bike",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80",
        description: "Lightweight aerodynamic road bike for speed and endurance on paved surfaces.",
        frameMaterial: "Aluminum alloy",
        wheelSize: 28,
        gears: 18,
        brakeType: "Caliper",
        terrain: "road",
        useCase: "road racing and fitness"
    },
    {
        id: 3,
        name: "Urban Commuter Hybrid",
        category: "Hybrid Bike",
        price: 649.99,
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        description: "Versatile hybrid bike perfect for city commuting and casual weekend rides.",
        frameMaterial: "Steel",
        wheelSize: 26,
        gears: 7,
        brakeType: "Mechanical disc",
        terrain: "urban",
        useCase: "daily commuting and leisure"
    },
    {
        id: 4,
        name: "Trail Blazer Fat Tire",
        category: "Fat Bike",
        price: 1099.99,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Fat tire bike designed for sand, snow, and rough terrain with exceptional traction.",
        frameMaterial: "Aluminum",
        wheelSize: 26,
        gears: 10,
        brakeType: "Hydraulic disc",
        terrain: "all-terrain",
        useCase: "extreme conditions and adventure"
    },
    {
        id: 5,
        name: "City Cruiser Comfort Bike",
        category: "Cruiser Bike",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        description: "Classic cruiser with comfortable seating position ideal for leisurely rides.",
        frameMaterial: "Steel",
        wheelSize: 26,
        gears: 3,
        brakeType: "Coaster",
        terrain: "paved",
        useCase: "casual riding and comfort"
    }
];

// Function to get products
function getProducts() {
    return products;
}

// Function to load header dynamically
function loadHeader() {
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            setupMobileMenu();
            updateAuthUI();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header-container').innerHTML = '<p>Error loading header</p>';
        });
}

// Function to load footer dynamically
function loadFooter() {
    fetch('../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            // Update current year in footer
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            document.getElementById('footer-container').innerHTML = '<p>Error loading footer</p>';
        });
}

// Function to load products on home page
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const productsHtml = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <a href="./pages/product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHtml;
}

// Function to setup mobile menu toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Function to update authentication UI in header
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('currentUser') !== null;
    const authButtons = document.getElementById('auth-buttons');
    const mobileLogin = document.getElementById('mobile-login');
    const mobileRegister = document.getElementById('mobile-register');
    const mobileProfile = document.getElementById('mobile-profile');
    const mobileLogout = document.getElementById('mobile-logout');
    
    if (isLoggedIn) {
        // User is logged in
        if (authButtons) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const userName = currentUser.name.split(' ')[0]; // First name only
            authButtons.innerHTML = `
                <a href="./pages/profile.html" class="btn btn-outline" id="profile-btn">
                    <i class="fas fa-user"></i> ${userName}
                </a>
                <button class="btn btn-primary" id="logout-header-btn">Logout</button>
            `;
            
            // Add logout event listener
            document.getElementById('logout-header-btn').addEventListener('click', function() {
                logoutUser();
                window.location.href = './index.html';
            });
        }
        
        // Update mobile menu
        if (mobileLogin) mobileLogin.style.display = 'none';
        if (mobileRegister) mobileRegister.style.display = 'none';
        if (mobileProfile) mobileProfile.style.display = 'block';
        if (mobileLogout) {
            mobileLogout.style.display = 'block';
            mobileLogout.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
                window.location.href = './index.html';
            });
        }
    } else {
        // User is not logged in
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="./login.html" class="btn btn-outline" id="login-btn">Login</a>
                <a href="./register.html" class="btn btn-primary" id="register-btn">Register</a>
            `;
        }
        
        // Update mobile menu
        if (mobileLogin) mobileLogin.style.display = 'block';
        if (mobileRegister) mobileRegister.style.display = 'block';
        if (mobileProfile) mobileProfile.style.display = 'none';
        if (mobileLogout) mobileLogout.style.display = 'none';
    }
}

// Function to check if user is on a protected page
function checkProtectedPage() {
    const protectedPages = ['profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = '../index.html';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check protected pages on page load
    checkProtectedPage();
});