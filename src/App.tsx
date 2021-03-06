import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components
import HomePage from './components/Home';
import NoMatch from './components/NoMatch';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';
import ProfilePage from './components/Auth/Profile';
import DefaultLayout from './components/containers/DefaultLayout';
import ProductList from './components/Products/List';
import CreateProduct from './components/Products/Create';
import UpdateProduct from './components/Products/Update';

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/update" element={<UpdateProduct />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
