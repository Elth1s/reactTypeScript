import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Components
import HomePage from './components/Home';
import NoMatch from './components/NoMatch';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';
import DefaultLayout from './components/containers/DefaultLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;
