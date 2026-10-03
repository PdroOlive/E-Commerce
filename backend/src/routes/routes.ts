import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/ProductControllers.js';

const router = express.Router();


router.get('/', getProducts);
router.post('/create', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;