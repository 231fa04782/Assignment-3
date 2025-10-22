const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const BOOKS_FILE = path.join(__dirname, 'books.json');
function readBooks() {
  try {
    const data = fs.readFileSync(BOOKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    } else {
      throw err;
    }
  }
}
function writeBooks(books) {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf-8');
}
app.get('/books', (req, res) => {
  try {
    const books = readBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read books data' });
  }
});
app.get('/books/available', (req, res) => {
  try {
    const books = readBooks();
    const availableBooks = books.filter(book => book.available === true);
    res.json(availableBooks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read books data' });
  }
});
app.post('/books', (req, res) => {
  const { title, author, available } = req.body;
  if (typeof title !== 'string' || typeof author !== 'string' || typeof available !== 'boolean') {
    return res.status(400).json({ error: 'Invalid book data' });
  }
  try {
    const books = readBooks();
    const maxId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    const newBook = {
      id: maxId + 1,
      title,
      author,
      available
    };
    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save book' });
  }
});
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }
  const { title, author, available } = req.body;
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (title !== undefined) {
      if (typeof title !== 'string') return res.status(400).json({ error: 'Invalid title' });
      books[bookIndex].title = title;
    }
    if (author !== undefined) {
      if (typeof author !== 'string') return res.status(400).json({ error: 'Invalid author' });
      books[bookIndex].author = author;
    }
    if (available !== undefined) {
      if (typeof available !== 'boolean') return res.status(400).json({ error: 'Invalid available flag' });
      books[bookIndex].available = available;
    }
    writeBooks(books);
    res.json(books[bookIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const deletedBook = books.splice(bookIndex, 1)[0];
    writeBooks(books);
    res.json(deletedBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Books API listening on port ${PORT}`);
});
