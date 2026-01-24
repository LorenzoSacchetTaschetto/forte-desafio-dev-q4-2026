import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Navbar, Nav } from 'react-bootstrap';
import { LoanService, LoanData } from '../services/LoanService';
import { AuthService } from '../services/AuthService';

interface LoansPageProps {
  onLogout: () => void;
  onCreateLoan?: () => void;
}

export const LoansPage: React.FC<LoansPageProps> = ({ onLogout, onCreateLoan }) => {
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = AuthService.getUser();

  console.log('LoansPage - User:', user);
  console.log('LoansPage - Token:', AuthService.getToken());
  console.log('LoansPage - isAuthenticated:', AuthService.isAuthenticated());
  console.log('LoansPage - localStorage user:', localStorage.getItem('user'));

  if (!user) {
    console.error('Usuário não encontrado no localStorage');
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">Usuário não autenticado. Faça login novamente.</Alert>
      </div>
    );
  }

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        console.log('Fetching loans...');
        const data = await LoanService.getUserLoans();
        console.log('Loans fetched:', data);
        setLoans(data);
      } catch (err: any) {
        console.error('Erro ao carregar empréstimos:', err);
        setError('Erro ao carregar empréstimos');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'emprestado':
        return <span className="badge bg-warning text-dark">Emprestado</span>;
      case 'devolvido':
        return <span className="badge bg-success">Devolvido</span>;
      case 'extraviado':
        return <span className="badge bg-danger">Extraviado</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Forte Library
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <span className="me-3 text-muted">👤 {user?.name}</span>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                🚪 Sair
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ margin: 0 }}>📖 Meus Empréstimos</h2>
          <Button 
            variant="success" 
            onClick={onCreateLoan} 
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
            }}
          >
            ➕ Novo Empréstimo
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : loans.length === 0 ? (
          <Alert variant="info">Você não tem empréstimos registrados.</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Livro ID</th>
                  <th>Data de Empréstimo</th>
                  <th>Data de Devolução Prevista</th>
                  <th>Devolução Real</th>
                  <th>Status</th>
                  <th>Multa (R$)</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.bookId}</td>
                    <td>{formatDate(loan.loanDate)}</td>
                    <td>{formatDate(loan.returnDate)}</td>
                    <td>
                      {loan.actualReturnDate ? formatDate(loan.actualReturnDate) : '-'}
                    </td>
                    <td>{getStatusBadge(loan.status)}</td>
                    <td>R$ {(Number(loan.fine) || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
};
