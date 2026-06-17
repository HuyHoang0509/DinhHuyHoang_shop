require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const Product = require('./models/productModel');

const app = express();
const PORT = process.env.PORT || 3000;

async function seedProducts() {
  try {
    const hasSeafood = await Product.findOne({ productName: 'Tôm Hùm' });
    if (!hasSeafood) {
      console.log('Seeding initial products...');
      const defaultProducts = [
        { productName: 'Tôm Hùm', category: 'Hải Sản', stockStatus: 'in_stock', unitPrice: 850000, tags: ['tươi sống', 'loại 1'] },
        { productName: 'Cua Cà Mau', category: 'Hải Sản', stockStatus: 'in_stock', unitPrice: 450000, tags: ['tươi sống', 'cua gạch'] },
        { productName: 'Cá Hồi', category: 'Hải Sản', stockStatus: 'in_stock', unitPrice: 250000, tags: ['đông lạnh', 'nhập khẩu'] },
        { productName: 'Mực Lá', category: 'Hải Sản', stockStatus: 'in_stock', unitPrice: 300000, tags: ['tươi sống', 'mực câu'] },
        { productName: 'Hàu Sữa', category: 'Hải Sản', stockStatus: 'in_stock', unitPrice: 150000, tags: ['tươi sống', 'ăn sống'] }
      ];
      await Product.insertMany(defaultProducts);
      console.log('Products seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Connect to MongoDB directly
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ShopDB')
  .then(async () => {
    console.log('MongoDB Connected successfully');
    await seedProducts();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Request Logger Middleware (bỏ đc)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/orders');
});
app.use('/orders', orderRoutes);

// 404 Route handler  (bỏ đc)
app.use((req, res, next) => {
  res.status(404).render('order', {
    orders: [],
    error: '404 - Page not found'
  });
});

// Global Error Handler (bỏ đc)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).send('500 - Internal Server Error');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
