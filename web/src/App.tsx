import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { LoansPage } from './pages/LoansPage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import { AdminLoansPage } from './pages/AdminLoansPage';
import { CreateBookPage } from './pages/CreateBookPage';
import { AuthService } from './services/AuthService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'loans' | 'create-loan' | 'admin-loans' | 'create-book'>('loans');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    document.title = 'Forte Library - Gerenciador de Empréstimos';
    const authenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    setIsAuthenticated(authenticated && !!user);
    setUserRole(user?.role || null);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-5">⏳ Carregando...</div>;
  }

  const handleLoginSuccess = () => {
    const user = AuthService.getUser();
    setUserRole(user?.role || null);
    setIsAuthenticated(true);
    setShowLogin(false);
    // Redireciona admins para admin-loans
    if (user?.role === 'admin') {
      setCurrentPage('admin-loans');
    } else {
      setCurrentPage('loans');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setShowLogin(true);
  };

  const handleLoanCreated = () => {
    setCurrentPage('loans');
  };

  return (
    <>
      {showLogin || !isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : userRole === 'admin' ? (
        currentPage === 'admin-loans' ? (
          <AdminLoansPage 
            onLogout={handleLogout}
            onCreateBook={() => setCurrentPage('create-book')}
          />
        ) : (
          <CreateBookPage 
            onBookCreated={() => setCurrentPage('admin-loans')}
            onBack={() => setCurrentPage('admin-loans')}
          />
        )
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
