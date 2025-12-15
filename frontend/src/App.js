import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import AuthSuccess from './pages/AuthSuccess';
import SelectRole from './pages/SelectRole';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Router>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/select-role" element={<SelectRole />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;