// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_7JSdqttRdHnC5gHouwVrHK12Nd0kgKI",
  authDomain: "futurestore-ce468.firebaseapp.com",
  projectId: "futurestore-ce468",
  storageBucket: "futurestore-ce468.firebasestorage.app",
  messagingSenderId: "739234758612",
  appId: "1:739234758612:web:e8fe79c6bd7255983e6041",
  measurementId: "G-XH7D7627GN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global state
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Sample Book Data (fallback for when backend is not available)
const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    price: 299,
    pages: 180,
    icon: "📕",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    rating: 4.5
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 349,
    pages: 281,
    icon: "📙",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    rating: 4.8
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    price: 499,
    pages: 443,
    icon: "📗",
    description: "A sweeping history of humankind from the Stone Age to modern times.",
    rating: 4.6
  },
  {
    id: 4,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    price: 399,
    pages: 236,
    icon: "📘",
    description: "An exploration of the universe from the Big Bang to black holes.",
    rating: 4.4
  },
  {
    id: 5,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    price: 359,
    pages: 304,
    icon: "📕",
    description: "A magical novel about infinite possibilities and second chances.",
    rating: 4.7
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    price: 279,
    pages: 432,
    icon: "📙",
    description: "A timeless love story and social commentary on Regency-era England.",
    rating: 4.7
  },
  {
    id: 7,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    price: 399,
    pages: 481,
    icon: "📗",
    description: "A thrilling mystery involving art, history, and secret societies.",
    rating: 4.3
  },
  {
    id: 8,
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    price: 329,
    pages: 328,
    icon: "📘",
    description: "A dystopian novel depicting a totalitarian future society.",
    rating: 4.6
  },
  {
    id: 9,
    title: "The Guns of August",
    author: "Barbara W. Tuchman",
    genre: "History",
    price: 449,
    pages: 511,
    icon: "📕",
    description: "A detailed account of the opening month of World War One.",
    rating: 4.5
  },
  {
    id: 10,
    title: "Outlander",
    author: "Diana Gabaldon",
    genre: "Romance",
    price: 429,
    pages: 642,
    icon: "📙",
    description: "An epic tale of time travel, romance, and adventure.",
    rating: 4.6
  },
  {
    id: 11,
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    genre: "Science",
    price: 379,
    pages: 224,
    icon: "📗",
    description: "A revolutionary look at evolution from the gene perspective.",
    rating: 4.4
  },
  {
    id: 12,
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    genre: "Mystery",
    price: 289,
    pages: 256,
    icon: "📘",
    description: "A classic detective mystery with an ingenious plot twist.",
    rating: 4.5
  }
];

let filteredBooks = books;
let currentFilter = 'All';
let cart = [];
let currentBookModal = null;

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to local data if API is not available
    return null;
  }
}

// Authentication Functions
async function registerUser(userData) {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

async function loginUser(credentials) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

  if (result) {
    authToken = result.token;
    currentUser = result.user;
    localStorage.setItem('authToken', authToken);
  }

  return result;
}

function logoutUser() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  cart = [];
  updateCartCount();
  goHome();
}

// Product Functions
async function fetchProducts(category = 'All', search = '') {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  return await apiRequest(`/products?${params}`);
}

async function fetchCart() {
  if (!authToken) return null;
  return await apiRequest('/cart');
}

async function addToCartAPI(productId, quantity = 1) {
  if (!authToken) {
    // Fallback to local cart
    const book = books.find(b => b.id === productId);
    if (book) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({...book, quantity: 1});
      }
      updateCartCount();
      alert(`${book.title} added to cart!`);
    }
    return;
  }

  const result = await apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });

  if (result) {
    cart = result.items.map(item => ({
      id: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));
    updateCartCount();
    alert(`${result.items.find(item => item.product._id === productId)?.product.title} added to cart!`);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
  // Try to load products from API, fallback to local data
  const apiProducts = await fetchProducts();
  if (apiProducts && apiProducts.products) {
    filteredBooks = apiProducts.products.map(product => ({
      id: product._id,
      title: product.title,
      author: product.author,
      genre: product.category,
      price: product.price,
      pages: product.pages,
      icon: product.icon,
      description: product.description,
      rating: product.rating
    }));
  }

  displayProducts(filteredBooks);

  // Load cart if user is logged in
  if (authToken) {
    const cartData = await fetchCart();
    if (cartData) {
      cart = cartData.items.map(item => ({
        id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity
      }));
      updateCartCount();
    }
  }
});

// Display Products
function displayProducts(booksToDisplay) {
  const container = document.getElementById('productsContainer');
  if (booksToDisplay.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No books found matching your criteria.</div>';
    return;
  }
  container.innerHTML = booksToDisplay.map(book => `
    <div class="product-card">
      <div class="product-image" style="font-size: 4rem; line-height: 200px;">${book.icon}</div>
      <div class="product-body">
        <div class="product-name">${book.title}</div>
        <div class="product-author">${book.author}</div>
        <div class="product-category">${book.genre}</div>
        <div class="product-price">₹${book.price}</div>
        <div class="product-rating">${'⭐'.repeat(Math.round(book.rating))} (${book.rating})</div>
        <div class="product-actions">
          <button class="view-btn" onclick="viewBook('${book.id}')">View Details</button>
          <button class="add-cart-btn" onclick="addToCart('${book.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Search Books
function searchBooks() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
  currentFilter = 'Search Results';
  updateFilterButtons();
  displayProducts(filteredBooks);
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchBooks();
});

// Filter Books
function filterBooks(genre) {
  currentFilter = genre;
  if (genre === 'All') {
    filteredBooks = books;
  } else {
    filteredBooks = books.filter(book => book.genre === genre);
  }
  updateFilterButtons();
  displayProducts(filteredBooks);
  scrollToProducts();
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(currentFilter) || (currentFilter === 'All' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });
}

// View Book Details
function viewBook(bookId) {
  const book = filteredBooks.find(b => b.id === bookId);
  if (book) {
    currentBookModal = book;
    document.getElementById('modalBookIcon').textContent = book.icon;
    document.getElementById('modalBookTitle').textContent = book.title;
    document.getElementById('modalBookAuthor').textContent = `by ${book.author}`;
    document.getElementById('modalBookDescription').textContent = book.description;
    document.getElementById('modalBookGenre').textContent = book.genre;
    document.getElementById('modalBookPages').textContent = book.pages;
    document.getElementById('modalBookPrice').textContent = `₹${book.price}`;
    document.getElementById('productModal').classList.add('active');
  }
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Add to Cart
function addToCart(bookId) {
  addToCartAPI(bookId);
}

function addToCartFromModal() {
  if (currentBookModal) {
    addToCartAPI(currentBookModal.id);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

// Cart Navigation
function goToCart() {
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('heroSection').style.display = 'none';
  document.getElementById('filterSection').style.display = 'none';
  document.getElementById('cartPage').style.display = 'block';
  document.getElementById('checkoutPage').style.display = 'none';
  document.getElementById('paymentPage').style.display = 'none';

  displayCart();
}

function displayCart() {
  const container = document.getElementById('cartItemsContainer');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Start adding books to your cart!</p>
        <a href="#" onclick="goHome()" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
    return;
  }

  const cartHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-price">₹${item.price}</div>
          </div>
          <div class="cart-item-qty">
            <button onclick="decreaseQty(${item.id})">−</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${item.id})">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `).join('')}
    </div>
    ${getCartSummary()}
  `;
  container.innerHTML = cartHTML;
}

function getCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = 100;
  const total = subtotal + tax + shipping;

  return `
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>₹${subtotal}</span>
      </div>
      <div class="summary-row">
        <span>Tax (5%):</span>
        <span>₹${tax}</span>
      </div>
      <div class="summary-row">
        <span>Shipping:</span>
        <span>₹${shipping}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>₹${total}</span>
      </div>
      <button class="checkout-btn" onclick="goToCheckout()">Proceed to Checkout</button>
      <button class="checkout-btn" style="background: #999;" onclick="goHome()">Continue Shopping</button>
    </div>
  `;
}

function increaseQty(bookId) {
  const item = cart.find(i => i.id === bookId);
  if (item) item.quantity++;
  updateCartCount();
  displayCart();
}

function decreaseQty(bookId) {
  const item = cart.find(i => i.id === bookId);
  if (item && item.quantity > 1) item.quantity--;
  else if (item && item.quantity === 1) removeFromCart(bookId);
  updateCartCount();
  displayCart();
}

function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  updateCartCount();
  displayCart();
}

// Checkout
function goToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('heroSection').style.display = 'none';
  document.getElementById('filterSection').style.display = 'none';
  document.getElementById('cartPage').style.display = 'none';
  document.getElementById('checkoutPage').style.display = 'block';
  document.getElementById('paymentPage').style.display = 'none';

  displayCheckoutSummary();
}

function displayCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = 100;
  const total = subtotal + tax + shipping;

  const summary = `
    ${cart.map(item => `
      <div class="order-item">
        <span>${item.title} (x${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `).join('')}
    <div class="order-total">
      <span>Total Amount:</span>
      <span>₹${total}</span>
    </div>
  `;
  document.getElementById('checkoutSummary').innerHTML = summary;
}

function selectPaymentMethod(method) {
  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
  event.target.closest('.payment-option').classList.add('selected');
}

// Process Payment
function processPayment(event) {
  event.preventDefault();

  // Validation
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const postalCode = document.getElementById('postalCode').value;

  if (!fullName || !email || !phone || !address || !city || !postalCode) {
    alert('Please fill in all required fields');
    return;
  }

  // Simulate payment processing
  alert('Processing your payment...');

  // Show payment success
  const orderNumber = 'BH' + Date.now();
  document.getElementById('orderNumber').textContent = `Order #${orderNumber}`;

  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('heroSection').style.display = 'none';
  document.getElementById('filterSection').style.display = 'none';
  document.getElementById('cartPage').style.display = 'none';
  document.getElementById('checkoutPage').style.display = 'none';
  document.getElementById('paymentPage').style.display = 'block';

  // Clear cart
  cart = [];
  updateCartCount();
}

// Navigation
function goHome() {
  document.getElementById('mainContent').style.display = 'block';
  document.getElementById('heroSection').style.display = 'block';
  document.getElementById('filterSection').style.display = 'block';
  document.getElementById('cartPage').style.display = 'none';
  document.getElementById('checkoutPage').style.display = 'none';
  document.getElementById('paymentPage').style.display = 'none';
  document.getElementById('searchInput').value = '';
  filterBooks('All');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function scrollToProducts() {
  document.getElementById('filterSection').scrollIntoView({behavior: 'smooth'});
}}