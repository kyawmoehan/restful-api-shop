const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const app = new express();
const PORT = process.env.PORT || 3000;

// connect mongodb
mongoose.connect('mongodb+srv://restapi_shop:restapi_12345@restapi-shop-mfjar.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// logging req
app.use(morgan('dev')); 

// public uploads folder    
app.use('/uploads',express.static('uploads'));

// handle json
app.use(express.urlencoded({extended: false}));
app.use(express.json()); 

// handle cors error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

// products route
app.use('/products', productRoutes);

// order route
app.use('/orders', orderRoutes);

// user route
app.use('/user', userRoutes);

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        }
    });
});

// port
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Server running on port ${PORT}`)
});