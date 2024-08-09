const express = require('express');
const {userLoginHandler, userSignUpHandler} = require('../Controllers/userLogin');


const route = express.Router();

route.post('/user/login',userLoginHandler);
route.post('/user/signup',userSignUpHandler)

module.exports = route;