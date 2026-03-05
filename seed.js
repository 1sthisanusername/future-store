const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    price: 299,
    pages: 180,
    icon: "📕",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    rating: 4.5,
    stock: 10
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    price: 349,
    pages: 281,
    icon: "📙",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    rating: 4.8,
    stock: 10
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Non-Fiction",
    price: 499,
    pages: 443,
    icon: "📗",
    description: "A sweeping history of humankind from the Stone Age to modern times.",
    rating: 4.6,
    stock: 10
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    price: 399,
    pages: 236,
    icon: "📘",
    description: "An exploration of the universe from the Big Bang to black holes.",
    rating: 4.4,
    stock: 10
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    price: 359,
    pages: 304,
    icon: "📕",
    description: "A magical novel about infinite possibilities and second chances.",
    rating: 4.7,
    stock: 10
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    price: 279,
    pages: 432,
    icon: "📙",
    description: "A timeless love story and social commentary on Regency-era England.",
    rating: 4.7,
    stock: 10
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    category: "Mystery",
    price: 399,
    pages: 481,
    icon: "📗",
    description: "A thrilling mystery involving art, history, and secret societies.",
    rating: 4.3,
    stock: 10
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    price: 329,
    pages: 328,
    icon: "📘",
    description: "A dystopian novel depicting a totalitarian future society.",
    rating: 4.6,
    stock: 10
  },
  {
    title: "The Guns of August",
    author: "Barbara W. Tuchman",
    category: "History",
    price: 449,
    pages: 511,
    icon: "📕",
    description: "A detailed account of the opening month of World War One.",
    rating: 4.5,
    stock: 10
  },
  {
    title: "Outlander",
    author: "Diana Gabaldon",
    category: "Romance",
    price: 429,
    pages: 642,
    icon: "📙",
    description: "An epic tale of time travel, romance, and adventure.",
    rating: 4.6,
    stock: 10
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    category: "Science",
    price: 379,
    pages: 224,
    icon: "📗",
    description: "A revolutionary look at evolution from the gene perspective.",
    rating: 4.4,
    stock: 10
  },
  {
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    category: "Mystery",
    price: 289,
    pages: 256,
    icon: "📘",
    description: "A classic detective mystery with an ingenious plot twist.",
    rating: 4.5,
    stock: 10
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/future-store');

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    await Product.insertMany(sampleBooks);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();