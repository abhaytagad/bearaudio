import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import AdminProductsPage from './components/AdminProductsPage';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ManageOrders from './components/ManageOrders';
import ManageUsers from './components/ManageUsers';
import ManagePayments from './components/ManagePayments';
import AuthForm from './userComponent/AuthForm';
import HomePage from './userComponent/HomePage';
import AddCategory from './components/AddCategory';
import Cart from './components/Cart';
import Profile from './userComponent/Profile';
import OrderList from './userComponent/OrderList';
import Checkout from './components/Checkout';
import ProductDetails from './userComponent/ProductDetails';


function App() {
  return (
   <Routes> 
      <Route path="/admin/login" element={<Auth />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/add" element={<AddProduct/>} />
      <Route path='/admin/products/edit/:productId' element={<EditProduct/>} />
      <Route path="/admin/orders" element={<ManageOrders/>} />
      <Route path="/admin/users" element={<ManageUsers/>} />
      <Route path="/admin/managepayment" element={<ManagePayments/>} />
      <Route path='/admin/addcategory' element={<AddCategory/>}/>
      

      <Route path="/" element={<HomePage/>} />
      <Route path="/user/login" element={<AuthForm/>} />
      <Route path='/user/cart' element={<Cart/>}/>
      <Route path='/user/profile' element={<Profile/>}/>
      <Route path='/user/orders' element={<OrderList/>}/>
      <Route path='/checkout' element={<Checkout/>} />
      <Route path='/product/:pro_id' element={<ProductDetails/>} />  
   </Routes> 
   
  );
}

export default App;
