import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AllBooks from './pages/AllBooks';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<AllBooks />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
