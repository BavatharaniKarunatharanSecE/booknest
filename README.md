# Online Book Management System - Phase 2

## Project Structure

booknest/
├── data/
│ ├── books.json
│ └── users.json
├── modules/
│ ├── books/
│ │ ├── middlewares/
│ │ │ └── booksValidation.js
│ │ ├── books-model.js
│ │ └── books-routes.js
│ ├── users/
│ │ ├── middlewares/
│ │ │ └── usersValidation.js
│ │ ├── users-model.js
│ │ └── users-routes.js
│ └── shared/
│ ├── middlewares/
│ │ ├── errorHandler.js
│ │ └── notFound.js
│ └── utils/
│ └── dataHelpers.js
├── server.js
├── package.json
└── README.md

## API Endpoints

### Books

- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:userId/favorites/:bookId` - Add book to favorites
- `DELETE /users/:userId/favorites/:bookId` - Remove book from favorites
