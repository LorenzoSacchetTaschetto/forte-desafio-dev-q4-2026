import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { AuthService } from '../services/AuthService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await AuthService.signup({ name, email, password });
      } else {
        await AuthService.login({ email, password });
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo/Header */}
          <div className="text-center mb-5">
            <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: '-1px'
              }}>
                Forte Library
              </h1>
            </div>
            <p style={{ color: '#6c757d', fontSize: '0.95rem', margin: 0 }}>
              Gerenciador de Empréstimos de Livros
            </p>
          </div>

          {/* Card Principal */}
          <Card>
            <Card.Body>
              <Card.Title style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0052cc' }}>
                {isSignup ? '✨ Criar Conta' : '🔐 Fazer Login'}
              </Card.Title>

              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {isSignup && (
                  <Form.Group className="mb-3">
                    <Form.Label>👤 Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>📧 Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>🔑 Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                  style={{ padding: '0.75rem', fontWeight: 600 }}
                >
                  {loading ? '⏳ Carregando...' : (isSignup ? '✨ Criar Conta' : '🔓 Entrar')}
                </Button>
              </Form>

              <div className="text-center">
                <small style={{ color: '#6c757d' }}>
                  {isSignup ? 'Já tem conta? ' : 'Não tem conta? '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                      setName('');
                      setEmail('');
                      setPassword('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0052cc',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    {isSignup ? 'Fazer login' : 'Cadastre-se'}
                  </button>
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <small style={{ color: '#6c757d' }}>
              © 2026 Forte Library. Todos os direitos reservados.
            </small>
          </div>
        </div>
      </Container>
    </div>
  );
};
