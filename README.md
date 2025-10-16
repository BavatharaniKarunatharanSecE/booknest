# Online Book Management System - Phase 2

## Implementation Details

### Tasks Completed:

1. **Data Structure Design**

   - Created JSON data structure for books entity
   - Added sample data with 5 books

2. **Modular Architecture Implementation**

   - Organized project using feature-based modules
   - Created `modules/books/` with models, routes, and middlewares

3. **Application-Level Middlewares**

   - Implemented `express.json()` and `express.urlencoded()`
   - Added 404 Not Found handler
   - Added error-handling middleware

4. **Business Logic in Models**

   - Implemented CRUD operations in `booksModel.js`:
     - `getAllBooks()`
     - `getBookByID(id)`
     - `addNewBook(data)`
     - `updateExistingBook(id, data)`
     - `deleteBook(id)`

5. **Independent Routes with Express Router**

   - Implemented all book routes in `booksRoute.js`

6. **Route-Level Middlewares with Validation**

   - Used `express-validator` for input validation
   - Created validation rules for all book fields
   - Added proper error handling for validation failures

7. **Proper HTTP Responses**
   - Return JSON responses for all endpoints
   - Implemented correct HTTP status codes:
     - 200 OK for successful GET/PUT/DELETE
     - 201 Created for successful POST
     - 400 Bad Request for validation errors
     - 404 Not Found for missing resources
     - 500 Internal Server Error for server errors

## API Endpoints

### Books Resource

- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

## Sample Book Object

## json

{
"id": 1,
"title": "Book Title",
"author": "Author Name",
"genre": "Genre",
"publicationYear": 2023,
"averageRating": 4.5,
"pages": 300
}
