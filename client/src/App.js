import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">CipherSQLStudio</h1>
          <p className="app__subtitle">Practice SQL queries and master database skills</p>
        </header>
        <main className="app__main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
          </Routes>
        </main>
        <footer className="app__footer">
          <p>&copy; 2024 CipherSQLStudio. Learn SQL the smart way.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

