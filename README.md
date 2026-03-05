# Future Store - E-Commerce Bookstore

An E-Commerce website for an online bookstore built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

3. **Start MongoDB**
   Make sure MongoDB is running

4. **Seed the database**
   ```bash
   node seed.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open the application**
   - Frontend: Open `index.html` in your browser
   - Backend API will be available at `http://localhost:5000`

## 📁 Project Structure

```
future-store/
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script.js               # Frontend JavaScript
├── server.js               # Backend server
├── seed.js                 # Database seeding script
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── config/
│   └── payment.js         # Payment configuration
├── models/                # Database models
├── routes/                # API routes
└── middleware/            # Authentication middleware
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `node seed.js` - Seed the database with sample data

## 🌟 Features

### ✅ Implemented Features
- Product catalog with search and filtering
- Shopping cart functionality
- Product details modal
- Checkout process
- Order confirmation
- Responsive design
- User authentication
- API integration with local fallback
- Database models and API routes
- Payment configuration setup

### 🔄 API Endpoints Available
- Authentication (register/login)
- Product management
- Shopping cart operations
- Order processing
- User profile management

## 🔒 Security & Best Practices
- JWT authentication
- Password hashing
- Input validation
- Rate limiting
- Security headers
- CORS protection

## 🚀 Deployment Ready
The application is now structured for production deployment with proper separation of concerns, security measures, and scalable architecture.

## 🆘 Need Help?
- Check the console for API connection errors
- Ensure MongoDB is running
- Verify `.env` configuration
- Run `node seed.js` to populate sample data
