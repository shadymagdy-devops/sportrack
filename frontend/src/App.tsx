import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Standings from './pages/Standings';
import Players from './pages/Players';
import './index.css';

const App: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/standings" element={<Standings />} />
      <Route path="/players" element={<Players />} />
    </Routes>
  </BrowserRouter>
);

export default App;
