# API de Empréstimos de Livros - Documentação

## Endpoints de Empréstimos

### Autenticação
Todos os endpoints requerem autenticação via token JWT no header `Authorization`.

### 1. Listar Todos os Empréstimos
**GET** `/loans`

Retorna lista de todos os empréstimos cadastrados.

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/loans
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "title": "Código Limpo",
    "userId": 1,
    "status": "emprestado",
    "fine": 0,
    "loanDate": "2026-01-22T10:00:00.000Z",
    "returnDate": "2026-02-21T10:00:00.000Z",
    "actualReturnDate": null,
    "createdAt": "2026-01-22T10:00:00.000Z",
    "updatedAt": "2026-01-22T10:00:00.000Z"
  }
]
```

---

### 2. Obter Empréstimo por ID
**GET** `/loans/:id`

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/loans/1
```

**Resposta (200):** Dados do empréstimo

**Resposta (404):** Empréstimo não encontrado

---

### 3. Listar Empréstimos de um Usuário
**GET** `/loans/user/:userId`

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/loans/user/1
```

---

### 4. Filtrar Empréstimos por Status
**GET** `/loans/status?status=emprestado`

Filtros válidos: `emprestado`, `devolvido`, `extraviado`

```bash
curl -H "Authorization: Bearer <token>" "http://localhost:8080/loans/status?status=emprestado"
```

---

### 5. Criar Novo Empréstimo
**POST** `/loans`

A data de retorno é calculada automaticamente (30 dias + ajuste para segunda se necessário).

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Código Limpo",
    "userId": 1,
    "loanDate": "2026-01-22T10:00:00Z"
  }' \
  http://localhost:8080/loans
```

**Campos:**
- `title` (obrigatório): Título do livro
- `userId` (obrigatório): ID do usuário
- `loanDate` (opcional): Data do empréstimo (padrão: data/hora atual)

**Resposta (201):** Empréstimo criado

---

### 6. Devolver Empréstimo
**PUT** `/loans/:id/return`

Marca o empréstimo como devolvido e calcula multa se houver atraso.

```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "actualReturnDate": "2026-02-25T14:30:00Z",
    "status": "devolvido"
  }' \
  http://localhost:8080/loans/1
```

**Campos:**
- `actualReturnDate` (opcional): Data real de devolução (padrão: data/hora atual)
- `status` (opcional): `devolvido` ou `extraviado` (padrão: `devolvido`)

**Cálculo de Multa:**
- Até 1 dia de atraso: sem multa
- Após 1 dia de atraso: R$ 0,50 por dia

---

### 7. Marcar como Extraviado
**PUT** `/loans/:id/lost`

```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  http://localhost:8080/loans/1/lost
```

---

### 8. Atualizar Empréstimo
**PUT** `/loans/:id`

Atualiza dados do empréstimo.

```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Código Limpo - Edição Revisada"
  }' \
  http://localhost:8080/loans/1
```

---

### 9. Excluir Empréstimo
**DELETE** `/loans/:id`

```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  http://localhost:8080/loans/1
```

**Resposta (204):** Sem conteúdo (sucesso)

---

## Estados do Empréstimo

1. **emprestado**: Estado inicial, livro foi emprestado
2. **devolvido**: Livro foi devolvido (com ou sem multa)
3. **extraviado**: Livro foi extraviado

## Regras de Multa

- Sem multa até **1 dia** de atraso
- **R$ 0,50** por dia após o primeiro dia de atraso
- Multa é calculada automaticamente ao devolver

## Cálculo de Data de Retorno

- Prazo padrão: **30 dias** após empréstimo
- Se cair em sábado: ajusta para segunda-feira (+2 dias)
- Se cair em domingo: ajusta para segunda-feira (+1 dia)

---

## Exemplo de Fluxo Completo

### 1. Criar empréstimo
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "userId": 1
  }' \
  http://localhost:8080/loans
```

### 2. Devolver no prazo (sem multa)
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "actualReturnDate": "2026-02-21T10:00:00Z"
  }' \
  http://localhost:8080/loans/1
```

### 3. Devolver com atraso (com multa)
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "actualReturnDate": "2026-02-25T14:30:00Z"
  }' \
  http://localhost:8080/loans/1
```
Resultado: 4 dias de atraso = R$ 1,50 de multa (0,50 × 3 dias após o 1º dia)
