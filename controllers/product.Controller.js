const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/product.model');
const PharmacyStock = require('../models/PharmacyStock');


const searchProducts = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 10, sort = 'name', order = 'asc' } = req.query;
  const isFeatured = req.path === '/featured';

//-----------------------  search query ------------------------//
  let searchQuery = {};
  
  if (isFeatured) {
    // For featured products, get the first 6 products (no specific featured field exists)
    // We'll use an empty query to get all products, then limit
  } else if (query) {
    searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'description.scientific_name': { $regex: query, $options: 'i' } },
        { 'description.product_name': { $regex: query, $options: 'i' } },
      ],
    };
  }

  //---------------------- Sorting ----------------------------//
  const sortOptions = {};
  if (sort === 'price') {
    sortOptions.price = order === 'asc' ? 1 : -1;
  } else if (sort === 'name') {
    sortOptions.name = order === 'asc' ? 1 : -1;
  } else if (sort === 'createdAt') {
    sortOptions.createdAt = order === 'asc' ? 1 : -1;
  }else if (sort === 'belongs_to') {
    sortOptions['description.belongs_to'] = order === 'asc'? 1 : -1;
}

  //----------------------- Pagination ----------------------------//
  const pageNum = parseInt(page);
  const limitNum = isFeatured ? 6 : parseInt(limit); // Limit featured products to 6
  const skip = (pageNum - 1) * limitNum;

  try {
    const products = await Product.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(searchQuery);

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//------------------------- GetProductById ---------------------------//
const getProductById = asyncHandler(async (req, res) => { 
  const product = await Product.findById(req.params.id);
   if (!product) 
    return res.status(404).json({ message: 'Product not found' }); 
   res.json(product); 
  });


  // ----------------------getproductwithpharmacies----------------------//
    
 const getProductWithPharmacies = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const stocks = await PharmacyStock.find({
    product_id: req.params.id,
    stock: { $gt: 0 }   
  }).populate('pharmacy_id', 'name location address');

  const pharmacies = stocks.map(stock => ({
    pharmacyName: stock.pharmacy_id.name,
    location: stock.pharmacy_id.location,
    address: stock.pharmacy_id.address,
    stock: stock.stock
    // deliveryAvailable: stock.deliveryAvailable,  

  }));

  res.json({
    product,
    pharmacies
  });
});


// --------------------------- checkproductAvailabilty----------------------//
const checkProductAvailability = asyncHandler(async (req, res) => {
  const stocks = await PharmacyStock.find({
    product_id: req.params.id,
    stock: { $gt: 0 }
  }).populate('pharmacy_id', 'name location address phone');

  const availableAt = stocks.map(stock => ({
    pharmacyName: stock.pharmacy_id.name,
    location: stock.pharmacy_id.location,
    address: stock.pharmacy_id.address,
    phone:stock.pharmacy_id.phone,
    stock: stock.stock
    // price: stock.price,
    // deliveryAvailable: stock.deliveryAvailable,
  }));

  res.json({ availableAt });
});


  //----------------------------------- Admin -------------------------------------//
  
  
  //createProduct
const createProduct = asyncHandler(async (req, res) => {
   const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save(); 
   res.status(201).json(savedProduct);
   });


//updateProduct
const updateProduct = asyncHandler(async (req, res) => {
   const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)
       return res.status(404).json({ message: 'Product not found' });
     res.json(updated);
     });


//deleteProduct
const deleteProduct = asyncHandler(async (req, res) => { 
  const deleted = await Product.findByIdAndDelete(req.params.id);
   if (!deleted)
     return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
   });


  module.exports = { getProductById, createProduct , updateProduct , deleteProduct ,searchProducts,getProductWithPharmacies,checkProductAvailability};  