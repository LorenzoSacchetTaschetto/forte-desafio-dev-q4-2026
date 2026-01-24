import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Navbar, Nav } from 'react-bootstrap';
import { BookService, CreateLoanService, Book } from '../services/BookService';
import { AuthService } from '../services/AuthService';

interface CreateLoanPageProps {
  onLoanCreated: () => void;
  onBack: () => void;
}

export const CreateLoanPage: React.FC<CreateLoanPageProps> = ({ onLoanCreated, onBack }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
  const [loanDate, setLoanDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = AuthService.getUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await BookService.getAllBooks();
        setBooks(booksData);
      } catch (err: any) {
        console.error('Erro ao carregar livros:', err);
        setError('Erro ao carregar lista de livros');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedBookId) {
      setError('Selecione um livro');
      return;
    }

    setCreating(true);

    try {
      await CreateLoanService.createLoan({
        bookId: Number(selectedBookId),
        loanDate: new Date(loanDate).toISOString(),
      });
      setSuccess('✅ Empréstimo criado com sucesso!');
      setSelectedBookId('');
      setLoanDate(new Date().toISOString().split('T')[0]);
      setTimeout(() => {
        onLoanCreated();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar empréstimo');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  const selectedBook = books.find((b) => b.id === Number(selectedBookId));

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
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={onBack}>
                ← Voltar
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                🚪 Sair
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2>➕ Criar Novo Empréstimo</h2>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Carregando livros...</span>
                </Spinner>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>📚 Selecione um Livro</Form.Label>
                  <Form.Select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : '')}
                    required
                    disabled={books.length === 0}
                  >
                    <option value="">-- Escolha um livro --</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} - {book.author}
                      </option>
                    ))}
                  </Form.Select>
                  {books.length === 0 && (
                    <small className="text-danger d-block mt-2">
                      ⚠️ Nenhum livro disponível
                    </small>
                  )}
                </Form.Group>

                {selectedBook && (
                  <Card bg="light" className="mb-4">
                    <Card.Body>
                      <Card.Title>📖 Detalhes do Livro</Card.Title>
                      <p>
                        <strong>Título:</strong> {selectedBook.title}
                      </p>
                      <p>
                        <strong>Autor:</strong> {selectedBook.author}
                      </p>
                      <p>
                        <strong>ISBN:</strong> {selectedBook.isbn}
                      </p>
                    </Card.Body>
                  </Card>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>📅 Data de Empréstimo</Form.Label>
                  <Form.Control
                    type="date"
                    value={loanDate}
                    onChange={(e) => setLoanDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={creating || !selectedBookId}
                    style={{ flex: 1 }}
                  >
                    {creating ? '⏳ Criando...' : '✅ Criar Empréstimo'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onBack}
                    disabled={creating}
                    style={{ flex: 1 }}
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
