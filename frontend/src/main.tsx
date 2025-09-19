import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './styles.css';
import TransactionsPage from './pages/TransactionsPage';
import SchoolPage from './pages/SchoolPage';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 max-w-7xl mx-auto">
        <nav className="flex gap-4 mb-6">
          <Link to="/" className="text-blue-600">Transactions</Link>
          <Link to="/school" className="text-blue-600">By School</Link>
          <Link to="/status" className="text-blue-600">Status Check</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TransactionsPage/>}/>
          <Route path="/school" element={<SchoolPage/>}/>
          <Route path="/status" element={<StatusPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
