const express = require('express');
const router = express.Router();
const {  getProductById,
         createProduct ,
         updateProduct ,
         deleteProduct ,
        searchProducts } = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/:id', getProductById);

//-------------------------- Admin ---------------------------//
router.post('/', createProduct);
router.put('/:id',  updateProduct);
router.delete('/:id', deleteProduct );


module.exports = router;
