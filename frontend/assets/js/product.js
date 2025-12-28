// Product Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Get product ID from URL
    const params = App.utils.getQueryParams();
    const productId = params.id;
    
    if (!productId) {
        showError('Product ID is required');
        return;
    }
    
    // Load product details
    await loadProduct(productId);
});

async function loadProduct(productId) {
    const productDetail = document.getElementById('product-detail');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    if (!productDetail) return;
    
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        const product = await response.json();
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        // Display product
        productDetail.innerHTML = createProductDetailHTML(product);
        
        // Setup buy now button
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (Auth.isAuthenticated()) {
                    window.location.href = '../checkout.html';
                } else {
                    // Show notification and redirect to login
                    App.utils.showNotification('Please login to continue', 'error');
                    setTimeout(() => {
                        window.location.href = '../login.html';
                    }, 1500);
                }
            });
        }
        
    } catch (error) {
        console.error('Error loading product:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
    }
}

function createProductDetailHTML(product) {
    const bikeIcons = ['bicycle', 'biking', 'motorcycle', 'road', 'mountain'];
    const randomIcon = bikeIcons[Math.floor(Math.random() * bikeIcons.length)];
    
    return `
        <div class="product-image">
            <i class="fas fa-${randomIcon}"></i>
        </div>
        <div class="product-info">
            <h1>${product.name || 'Premium Bicycle'}</h1>
            <div class="product-price">$${product.price || '999.99'}</div>
            <div class="product-description">
                <p>${product.description || 'This high-performance bicycle is designed for both casual riders and serious cyclists. Featuring a lightweight frame, precision gears, and responsive brakes for a smooth and comfortable ride.'}</p>
            </div>
            
            <div class="product-specs">
                <div class="spec-item">
                    <span class="spec-label">Frame Material</span>
                    <span class="spec-value">Carbon Fiber</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Wheel Size</span>
                    <span class="spec-value">29 inches</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Gears</span>
                    <span class="spec-value">21-speed</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Weight</span>
                    <span class="spec-value">12.5 kg</span>
                </div>
            </div>
            
            <div class="product-actions">
                <button id="buy-now-btn" class="btn btn-primary btn-large">
                    <i class="fas fa-shopping-cart"></i> Buy Now
                </button>
            </div>
        </div>
    `;
}

function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.innerHTML = `
            ${message}<br>
            <a href="../index.html" class="btn btn-secondary mt-2">Back to Store</a>
        `;
        errorElement.style.display = 'block';
    }
}