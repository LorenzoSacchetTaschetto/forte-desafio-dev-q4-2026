# forte-security-desafio-dev-q4-2025

Desenvolva uma aplicação para uma biblioteca em que seja possível gerenciar os empréstimos de livros e calcular a multa no caso de devolução atrasada ou não devolução.

#### Especificações:

- Deve ser possível criar, editar, listar e excluir cada um dos empréstimos realizados
- Um empréstimo pode estar em um dos seguintes estados: "emprestado", "devolvido" ou "extraviado".
- O empréstimo de um livro é iniciado no estado "emprestado", e depois podemos definí-lo como "devolvido" ou "extraviado".
- Será necessário coletar as datas de empréstimo e devolução, para calcular uma possível multa.
- Ao realizar o empréstimo de um livro, a data de retorno deve ser calculada automaticamente como 30 dias após a data de início do empréstimo. Se a data de devolução for um sábado ou domingo, a data de retorno deve ser ajustada para a próxima segunda-feira.
- Se a devolução ocorrer com até um dia de atraso, o empréstimo será considerado devolvido com atraso, mas não haverá multa.
- Após um dia de atraso, a multa será de R$ 0,50 (cinquenta centavos) por dia de atrasado (incluindo o primeiro dia de atraso).
- Todas as informações devem ser persistidas no banco de dados, de forma que, ao reiniciar a aplicação, os dados sejam mantidos.
- O back-end já possui um banco de dados configurado utilizando Docker, e você deve utilizá-lo para todas as operações de persistência.
- Embora seja uma aplicação fictícia, a segurança e confiabilidade da solução serão fatores considerados na avaliação.

Convidamos você a utilizar os projetos já existentes nas pastas `api` e `web`.

Permitirmos que você altere o projeto como preferir, incluindo dependências, layout, bibliotecas, documentação no README, recursos extras, etc. Apenas atente-se às Instruções de Avaliação presentes no final desse documento.

Se quiser ir além (é opcional), você pode implementar testes automatizados para garantir as regras de negócio da aplicação.

# Instruções para executar o projeto

O projeto é dividido entre api e web:

- API (pasta `api`): Projeto em Node.JS que expões as rotas da API por uma interface HTTP.
- Web (pasta `web`): Front-end em React que consome as rotas providas pela API

Devido à existência de duas aplicações, será necessário executar os dois processos separados em dois terminais distintos do sistema operacional.

## Sugestão

Se você preferir um ambiente remoto, não quiser instalar as dependências no seu computador ou tiver problemas para rodar o projeto, você pode abrir este projeto em um [GitHub CodeSpace](https://docs.github.com/pt/codespaces/overview) (uma máquina virtual gratuita para desenvolvimento).

Ao iniciar o projeto no GitHub CodeSpace, você verá nos logs que as dependências serão instaladas.

Se você optar por utilizar o GitHub CodeSpace, todas as etapas que envolvem a instalação do Node.JS, Docker ou Docker Compose podem ser ignoradas.

## Front-end (web)

1. Instale o Node.JS versão 20 na sua máquina
2. Entre na pasta `web` com `cd web`
3. Instale as dependências com `yarn install`
4. Rode o projeto de desenvolvimento com `yarn dev`
5. Teste no seu navegador o acesso ao projeto acessando [http://localhost:3000](http://localhost:3000). Se você estiver utilizando o GitHub CodeSpaces, deverá consultar instruções da plataforma de como acessar o servidor.

## Back-end (api)

1. Instale o Node.JS versão 20 na sua máquina
2. Instale o Docker e o Docker Compose na sua máquina
3. Abra um novo terminal, ou uma nova aba no mesmo terminal
4. Entre na pasta `api` com `cd api`
5. Instale as dependências com `yarn install`
6. Execute `yarn dev` para iniciar o projeto
7. Teste a API no navegador acessando [http://localhost:8080](http://localhost:8080). Se você estiver utilizando o GitHub CodeSpaces, deverá consultar instruções da plataforma de como acessar o servidor. Além disso, se você utilizar o GitHub CodeSpaces, terá de atualizar a URL da API no projeto `web` para a URL correta.
8. O back-end já possui um ambiente com o banco de dados PostgreSQL instalado no formato de contêiners Docker, e pode ser acessado pelo endereço "database" na porta 5432 (se estiver dentro de um container) ou "127.0.0.1" na porta 5432 (se estiver em um sistema operacional nativo).

# Entrega

1. Consulte as Instruções de Avaliação presentes nesse documento (as quais o avaliador utilizará).
2. Publique o seu código em um repositório público no GitHub utilizando a sua conta pessoal.
3. Encaminhe o seu nome completo, e-mail e o link público do seu repositório no GitHub para o e-mail `jordano.xavier@fortesecurity.com.br` **até as 23:59:59 horas do dia 23 de novembro de 2025 (domingo)**.
4. Tente abrir o link em uma aba anônima do navegador para garantir que o avaliador conseguirá acessá-lo.

# Instruções de Avaliação

O projeto será executado em um [GitHub CodeSpace](https://docs.github.com/pt/codespaces/overview). Por isso, é uma boa ideia testar o seu repositório nessa plataforma para garantir que o projeto roda corretamente em um CodeSpace recém criado.

Processo que o avaliador realizará para executar o seu projeto:

1. Abrir o repositório em um CodeSpace
2. Instalar as dependências do front-end e back-end.
3. No primeiro terminal entrar na pasta api, e executar o comando `yarn dev`
4. No segundo terminal entrar na pasta web, e executar o comando `yarn dev`
5. Alterar a porta 8080 para visibilidade pública na lista de portas redirecionadas pelo GitHub CodeSpace
6. Autualize a URL presente em `web/src/services/Api.ts` para a fornecida pelo GitHub CodeSpace na porta 8080 para que a API seja acessada.

Se a aplicação não rodar, ou não foi possível acessá-la, o candidato será desclassificado.

Com o projeto rodando, o avaliador realizará os testes funcionais, clicando nos elementos e identificando os resultados. Após isso, será realizada uma análise de código, organização e segurança no repositório.
