const express = require('express');
const {userLoginHandler, userSignUpHandler} = require('../Controllers/userLogin');
const verifyJWT = require('../Middleware/JWTmiddleware');
const { adminLoginHandler ,adminSignUpHandler} = require('../Controllers/adminController');
const{addProduct, getAllProducts, getProductById, editProduct, deleteById,adminDashboard} = require('../Controllers/adminProduct')
const{getAllOrders, getOrderById, updateOrderStatus, deleteOrder} = require('../Controllers/adminOrder')
const{getUsers, updateUser, deleteUser, getUsersById} = require('../Controllers/adminUser')
const{addCategory, getAllCategory} = require('../Controllers/adminCategory')
const{getPayments} = require('../Controllers/adminPayments');
const { getCart, addCart, deleteCart } = require('../Controllers/cartHandler');
const{allOrders,placeOrder} = require('../Controllers/userOrder')

const route = express.Router();

route.post('/admin/login',adminLoginHandler);
route.post('/admin/signup',adminSignUpHandler)
route.post('/admin/products', addProduct);
route.get('/admin/dashboard',verifyJWT,adminDashboard)
route.get('/admin/products', verifyJWT,getAllProducts);
route.post('/admin/products/add',verifyJWT,addProduct)
route.put('/admin/products/edit/:productId',verifyJWT,editProduct)
route.get('/products/:productId',verifyJWT,getProductById)
route.delete('/admin/products/:productId',verifyJWT,deleteById)

route.get('/admin/orders', verifyJWT,getAllOrders);
route.get('/admin/orders/:orderId',verifyJWT, getOrderById);
route.put('/admin/orders/:orderId/status', verifyJWT, updateOrderStatus);
route.delete('/admin/orders/:orderId',verifyJWT, deleteOrder);


route.get('/user/profile',verifyJWT, getUsersById);
route.get('/admin/users',verifyJWT, getUsers);
route.put('/admin/users/:userId',verifyJWT, updateUser);
route.delete('/admin/users/:userId',verifyJWT, deleteUser);

route.post('/admin/add-category',verifyJWT,addCategory);
route.get('/admin/payments',verifyJWT,getPayments);
route.get('/all/categories',getAllCategory)

route.get('/all/products',getAllProducts)

route.delete('/cart/remove/:pro_id',verifyJWT,deleteCart)
route.post('/cart/add',verifyJWT,addCart);
route.get('/cart', verifyJWT,getCart);
route.post('/user/login', userLoginHandler);
route.post('/user/signup', userSignUpHandler);
route.get('/user/orders', verifyJWT,allOrders );
route.post('/user/order', verifyJWT, placeOrder);

module.exports = route;