# 📚 Biblioteca Pessoal - CP4 Mobile

Aplicativo mobile desenvolvido em **React Native** com integração ao **Firebase**, como parte da avaliação prática (CP4).  
O sistema permite gerenciar uma biblioteca pessoal, com autenticação de usuários, cadastro e organização de livros.

---

## 🚀 Funcionalidades

- **Autenticação Firebase**
  - Cadastro, login, logout e recuperação de senha
  - Validação de campos e feedback visual

- **Gerenciamento de Livros (CRUD - Firestore)**
  - Adicionar, visualizar, editar e excluir livros
  - Confirmação antes da exclusão
  - Atualização em tempo real

- **Busca e Organização**
  - Pesquisa por título ou autor
  - Filtros por gênero literário e status de leitura
  - Ordenação por data ou ordem alfabética
  - Sistema de favoritos

- **Interface e Navegação**
  - Navegação por **Stack** e **Tabs**
  - Telas condicionais (usuário logado/não logado)
  - Layout responsivo e consistente

- **Perfil do Usuário**
  - Exibição e edição de dados básicos
  - Estatísticas de leitura (livros cadastrados, lidos, etc.)

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) (Expo ou CLI)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [React Navigation v6](https://reactnavigation.org/)
- [Context API](https://reactjs.org/docs/context.html) para gerenciamento de estado
- UI: **Native Base / Styled Components / React Native Elements**
- Ícones: **react-native-vector-icons**

---

## 📂 Estrutura do Projeto

```
/src
  /components   → Botões, inputs, cards reutilizáveis
  /screens      → Telas principais (Login, Register, Home, AddBook, BookDetail, EditBook, Favorites, Profile, Search)
  /services     → Integração com Firebase
  /context      → Estado global (AuthContext)
  /navigation   → Configuração do React Navigation
```

---

## ⚙️ Configuração e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/CP4-Mobile.git
cd CP4-Mobile
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
```

### 3. Configurar Firebase
- Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
- Ative **Authentication** (Email/Senha) e **Firestore Database**
- Configure os arquivos `.env` com as chaves do seu app Firebase:
```env
API_KEY=xxxxxxxxxxxx
AUTH_DOMAIN=xxxxxxxxxxxx
PROJECT_ID=xxxxxxxxxxxx
STORAGE_BUCKET=xxxxxxxxxxxx
MESSAGING_SENDER_ID=xxxxxxxxxxxx
APP_ID=xxxxxxxxxxxx
```

### 4. Rodar o app
```bash
npx expo start
# ou, se usar React Native CLI:
npx react-native run-android
npx react-native run-ios
```

## Link do Video

- https://www.youtube.com/watch?v=Hr_vGF8kMSw

---

## 📱 Telas do Aplicativo

- Login / Registro / Recuperação de Senha  
- Home (listagem de livros)  
- AddBook (adicionar livro)  
- BookDetail (detalhes do livro)  
- EditBook (editar livro)  
- Search (busca e filtros)  
- Favorites (livros favoritos)  
- Profile (perfil do usuário)  

---

## ✅ Critérios Atendidos (PDF CP4)

- [x] Setup e configuração com Firebase  
- [x] Autenticação completa (login, registro, logout, recuperação de senha)  
- [x] CRUD de livros no Firestore  
- [x] Navegação stack + tabs  
- [x] Busca, filtros e favoritos  
- [x] Tela de perfil e estatísticas  
- [x] Estrutura organizada, boas práticas e README documentado  

---

## 👤 Autor

Desenvolvido por:
**Kauã Fermino Zipf  -  RM558957**  
**Caetano Matos Penafiel  -  RM557984**  
**Victor Egidio Lira  -  556653**  
**Jennifer Kaori Suzuki - RM554661**  
**Felipe Fidelix -  RM556426**  

Disciplina: **Mobile Application Development - FIAP**  
Entrega: **CP4**
