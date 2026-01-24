import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { LoansPage } from './pages/LoansPage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import { AuthService } from './services/AuthService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'loans' | 'create-loan'>('loans');

  useEffect(() => {
    document.title = 'Forte Library - Gerenciador de Empréstimos';
    const authenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    console.log('App - Checking auth. Token:', !!AuthService.getToken(), 'User:', user);
    setIsAuthenticated(authenticated && !!user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-5">⏳ Carregando...</div>;
  }

  const handleLoginSuccess = () => {
    console.log('Login successful, updating state');
    setIsAuthenticated(true);
    setCurrentPage('loans');
  };

  const handleLogout = () => {
    console.log('Logout, updating state');
    setIsAuthenticated(false);
  };

  const handleLoanCreated = () => {
    setCurrentPage('loans');
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : currentPage === 'loans' ? (
        <LoansPage 
          onLogout={handleLogout}
          onCreateLoan={() => setCurrentPage('create-loan')}
        />
      ) : (
        <CreateLoanPage 
          onLoanCreated={handleLoanCreated}
          onBack={() => setCurrentPage('loans')}
        />
      )}
    </>
  );
}

export default App;
