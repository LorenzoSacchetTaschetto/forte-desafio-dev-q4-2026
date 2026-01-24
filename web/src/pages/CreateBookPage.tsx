import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import { BookService } from '../services/BookService';
import { AuthService } from '../services/AuthService';

interface CreateBookPageProps {
  onBookCreated: () => void;
  onBack: () => void;
}

export const CreateBookPage: React.FC<CreateBookPageProps> = ({ onBookCreated, onBack }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = AuthService.getUser();

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">Acesso negado. Apenas administradores podem criar livros.</Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title.trim() || !author.trim()) {
        setError('Título e Autor são obrigatórios');
        setLoading(false);
        return;
      }

      await BookService.createBook({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim() || undefined,
        quantity: parseInt(quantity) || 1,
      });

      setTitle('');
      setAuthor('');
      setIsbn('');
      setQuantity('1');
      alert('Livro criado com sucesso!');
      onBookCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar livro');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
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
          <h2 style={{ margin: 0 }}>📚 Criar Novo Livro</h2>
          <Button variant="secondary" onClick={onBack}>
            ← Voltar
          </Button>
        </div>

        <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Título do Livro</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Dom Casmurro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Autor</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Machado de Assis"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>ISBN (opcional)</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: 978-8501-01234-5"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Quantidade</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ex: 5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                  }}
                >
                  {loading ? '⏳ Criando...' : '✅ Criar Livro'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
