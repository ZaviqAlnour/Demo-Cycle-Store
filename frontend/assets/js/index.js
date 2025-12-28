// Home Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in, redirect auth pages if so
    if (Auth.isAuthenticated() && 
        (window.location.pathname.includes('login.html') || 
         window.location.pathname.includes('register.html'))) {
        window.location.href = './index.html';
    }
    
    // Load products
    await loadProducts();
});

async function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    if (!productsGrid) return;
    
    try {
        const response = await fetch('http://localhost:3000/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        // Clear any existing content
        productsGrid.innerHTML = '';
        
        // Display products (show 4-5 as specified)
        const productsToShow = products.slice(0, 5);
        
        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // If no products
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1;">
                    <p>No products available at the moment.</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card card';
    
    // Use different icons for variety
    const bikeIcons = ['bicycle', 'biking', 'motorcycle', 'road', 'mountain'];
    const randomIcon = bikeIcons[Math.floor(Math.random() * bikeIcons.length)];
    
    card.innerHTML = `
        <div class="card-img">
            <i class="fas fa-${randomIcon}"></i>
        </div>
        <div class="card-body">
            <h3>${product.name || 'Premium Bicycle'}</h3>
            <div class="product-price">$${product.price || '999.99'}</div>
            <p class="product-description">
                ${product.description || 'High-quality bicycle designed for performance and comfort.'}
            </p>
            <a href="./pages/product.html?id=${product.id || '1'}" class="btn btn-primary btn-block">
                View Details
            </a>
        </div>
    `;
    
    return card;
}