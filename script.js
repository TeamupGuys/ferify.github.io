// Ferify Store - Complete JavaScript
class FerifyStore {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Elegant Red Maxi Dress",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1576638148968-2f176cfd1784?w=400&h=500&fit=crop",
                category: "Maxi"
            },
            {
                id: 2,
                name: "Classic Blue Midi Dress",
                price: 69.99,
                image: "https://images.unsplash.com/photo-1594909296086-1eead605c395?w=400&h=500&fit=crop",
                category: "Midi"
            },
            {
                id: 3,
                name: "Sophisticated Black Dress",
                price: 99.99,
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop",
                category: "Evening"
            },
            {
                id: 4,
                name: "Pure White Summer Dress",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
                category: "Casual"
            },
            {
                id: 5,
                name: "Romantic Pink Dress",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1571003113988-95a9043da3b4?w=400&h=500&fit=crop",
                category: "Party"
            },
            {
                id: 6,
                name: "Emerald Green Gown",
                price: 129.99,
                image: "https://images.unsplash.com/photo-1595777457928-6c9c3025e43b?w=400&h=500&fit=crop",
                category: "Formal"
            },
            {
                id: 7,
                name: "Sunshine Yellow Dress",
                price: 74.99,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
                category: "Beach"
            },
            {
                id: 8,
                name: "Royal Purple Dress",
                price: 94.99,
                image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop",
                category: "Cocktail"
            }
        ];

        this.cart = JSON.parse(localStorage.getItem('ferifyCart')) || [];
        this.orders = JSON.parse(localStorage.getItem('ferifyOrders')) || [];
        this.userProfile = JSON.parse(localStorage.getItem('ferifyProfile')) || {
            name: 'Guest User',
            email: 'guest@example.com',
            phone: ''
        };

        this.init();
    }

    init() {
        this.renderProducts();
        this.updateCartUI();
        this.renderOrders();
        this.loadProfile();
        this.bindEvents();
        this.smoothScrolling();
    }

    bindEvents() {
        // Cart modal
        document.getElementById('cartIcon').addEventListener('click', () => this.toggleModal('cartModal'));
        document.getElementById('closeCart').addEventListener('click', () => this.toggleModal('cartModal'));

        // Payment modal
        document.getElementById('closePayment').addEventListener('click', () => this.toggleModal('paymentModal'));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.toggleModal(e.target.id);
            }
        });

        // Profile icon
        document.getElementById('profileIcon').addEventListener('click', () => {
            document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });
        });
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="store.addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x <span class="quantity">${item.quantity}</span></p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="store.removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.getCartTotal();
        document.getElementById('cartTotal').textContent = total.toFixed(2);
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCart();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartUI() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    saveCart() {
        localStorage.setItem('ferifyCart', JSON.stringify(this.cart));
    }

    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        if (modalId === 'cartModal') {
            this.renderCart();
        }
    }

    openPayment() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!', 'error');
            return;
        }
        this.toggleModal('cartModal');
        this.toggleModal('paymentModal');
    }

    processPayment() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (cardNumber.length !== 16 || cvv.length !== 3 || !expiry || !cardName) {
            this.showNotification('Please fill all payment details correctly!', 'error');
            return;
        }

        // Process order
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: this.getCartTotal(),
            date: new Date().toLocaleDateString(),
            status: 'pending'
        };

        this.orders.unshift(order);
        this.cart = [];
        this.saveOrders();
        this.saveCart();
        this.updateCartUI();

        // Close modals
        this.toggleModal('paymentModal');

        // Show success
        this.showNotification('Payment successful! Order placed.', 'success');
        this.renderOrders();
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        if (this.orders.length === 0) {
            ordersList.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem;">No orders yet. Start shopping!</p>';
            return;
        }

        ordersList.innerHTML = this.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${order.status}">${order.status.toUpperCase()}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                            <span>${item.name} (x${item.quantity})</span>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: #333;">
                    <span>Total: $${order.total.toFixed(2)}</span>
                    <span>Date: ${order.date}</span>
                </div>
            </div>
        `).join('');
    }

    saveOrders() {
        localStorage.setItem('ferifyOrders', JSON.stringify(this.orders));
    }

    loadProfile() {
        document.getElementById('userName').textContent = this.userProfile.name;
        document.getElementById('userEmail').textContent = this.userProfile.email;
        document.getElementById('profileName').value = this.userProfile.name;
        document.getElementById('profileEmail').value = this.userProfile.email;
        document.getElementById('profilePhone').value = this.userProfile.phone || '';
    }

    saveProfile() {
        this.userProfile = {
            name: document.getElementById('profileName').value || 'Guest User',
            email: document.getElementById('profileEmail').value || 'guest@example.com',
            phone: document.getElementById('profilePhone').value || ''
        };

        localStorage.setItem('ferifyProfile', JSON.stringify(this.userProfile));
        this.loadProfile();
        this.showNotification('Profile updated successfully!', 'success');
    }

    showNotification(message, type = 'success') {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00b894' : '#ff4757'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    smoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Initialize Store
const store = new FerifyStore();

// Global functions for onclick events
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Input formatting
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        e.target.value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    if (e.target.id === 'expiryDate') {
        e.target.value = e.target.value.replace(/[^0-9/]/g, '').replace(/(.{2})/g, '$1/').slice(0, 5);
    }
});

// Mobile menu toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});
