import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Navbar, Nav, Form, Modal } from 'react-bootstrap';
import { LoanService, LoanData } from '../services/LoanService';
import { AuthService } from '../services/AuthService';
import { BookService, Book } from '../services/BookService';
import { UserService, User } from '../services/UserService';

interface AdminLoanData extends LoanData {
  userName?: string;
  bookTitle?: string;
}

interface AdminLoansPageProps {
  onLogout: () => void;
  onCreateBook?: () => void;
}

export const AdminLoansPage: React.FC<AdminLoansPageProps> = ({ onLogout, onCreateBook }) => {
  const [loans, setLoans] = useState<AdminLoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<AdminLoanData | null>(null);
  const [newStatus, setNewStatus] = useState<'emprestado' | 'devolvido' | 'extraviado'>('emprestado');

  const user = AuthService.getUser();

  console.log('AdminLoansPage - User:', user);
  console.log('AdminLoansPage - User Role:', user?.role);

  if (!user) {
    console.error('Usuário não encontrado no localStorage');
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">Usuário não autenticado. Faça login novamente.</Alert>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">Acesso negado. Esta página é apenas para administradores.</Alert>
      </div>
    );
  }

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        console.log('Fetching all loans for admin...');
        const loansData = await LoanService.getAllLoans();
        console.log('All loans fetched:', loansData);

        // Buscar informações de usuários e livros
        const enhancedLoans = await Promise.all(
          loansData.map(async (loan) => {
            let userName = `Usuário #${loan.userId}`;
            let bookTitle = `Livro #${loan.bookId}`;

            try {
              const userInfo = await UserService.getUserById(loan.userId);
              userName = userInfo.name;
            } catch (err) {
              console.warn(`Erro ao buscar usuário ${loan.userId}:`, err);
            }

            try {
              const bookInfo = await BookService.getAllBooks().then(books =>
                books.find(b => b.id === loan.bookId)
              );
              if (bookInfo) {
                bookTitle = bookInfo.title;
              }
            } catch (err) {
              console.warn(`Erro ao buscar livro ${loan.bookId}:`, err);
            }

            return { ...loan, userName, bookTitle };
          })
        );

        setLoans(enhancedLoans);
      } catch (err: any) {
        console.error('Erro ao carregar empréstimos:', err);
        setError(err.response?.data?.message || 'Erro ao carregar empréstimos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllLoans();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  const handleDeleteLoan = async (loanId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este empréstimo?')) {
      try {
        await LoanService.deleteLoan(loanId);
        setLoans(loans.filter(loan => loan.id !== loanId));
        alert('✅ Empréstimo deletado com sucesso!');
      } catch (err: any) {
        alert(`❌ Erro ao deletar: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedLoan) return;

    try {
      const updatedLoan = await LoanService.updateLoanStatus(selectedLoan.id, newStatus);
      setLoans(loans.map(loan => 
        loan.id === selectedLoan.id ? { ...loan, status: newStatus } : loan
      ));
      setShowStatusModal(false);
      alert('✅ Status atualizado com sucesso!');
    } catch (err: any) {
      alert(`❌ Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  };

  const openStatusModal = (loan: AdminLoanData) => {
    setSelectedLoan(loan);
    setNewStatus(loan.status);
    setShowStatusModal(true);
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

  const formatDate = (dateString: string) => {
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Forte Library - 👑 Admin
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
          <h2 style={{ margin: 0 }}>📊 Todos os Empréstimos</h2>
          <Button 
            variant="success" 
            onClick={onCreateBook}
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
            📚 Criar Livro
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
          <Alert variant="info">Nenhum empréstimo registrado no sistema.</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Livro</th>
                  <th>Data de Empréstimo</th>
                  <th>Data de Devolução Prevista</th>
                  <th>Devolução Real</th>
                  <th>Status</th>
                  <th>Multa (R$)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.userName}</td>
                    <td>{loan.bookTitle}</td>
                    <td>{formatDate(loan.loanDate)}</td>
                    <td>{formatDate(loan.returnDate)}</td>
                    <td>
                      {loan.actualReturnDate ? formatDate(loan.actualReturnDate) : '-'}
                    </td>
                    <td>{getStatusBadge(loan.status)}</td>
                    <td>R$ {(Number(loan.fine) || 0).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => openStatusModal(loan)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        ✏️ Status
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteLoan(loan.id)}
                      >
                        🗑️ Deletar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      {/* Modal para editar status */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Status - Empréstimo #{selectedLoan?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Novo Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="emprestado">Emprestado</option>
                <option value="devolvido">Devolvido</option>
                <option value="extraviado">Extraviado</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
