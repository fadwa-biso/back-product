const globalMiddleware = require("./middlewares/global.middleware");
const cors = require('cors');
const connectDB = require("./config/db.connect");
const express = require('express');
const productRoutes = require('./routes/product.routes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();

// Connect to database
connectDB();

//  middlewares
app.use(globalMiddleware);
app.use(cors());
app.use(express.json());



// Routes
app.get('/', (req, res) => {
    res.send('API is running..');
});

app.use('/api/products', productRoutes);

// Error handler
app.use(errorHandler);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});