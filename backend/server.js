const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', // Change if needed
  database: 'wishlist_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected...');
});

// Routes

// Add a new item
app.post('/wishlist', (req, res) => {
  const { user_id, item_name, description, link, priority } = req.body;
  const sql = `INSERT INTO wishlist_items (user_id, item_name, description, link, priority, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())`;
  db.query(sql, [user_id, item_name, description, link, priority], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Item added', id: result.insertId });
  });
});

// Get all items for a user
app.get('/wishlist/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY priority DESC, created_at DESC`;
  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update an item
app.put('/wishlist/:id', (req, res) => {
  const { id } = req.params;
  const { item_name, description, link, priority } = req.body;
  const sql = `UPDATE wishlist_items SET item_name = ?, description = ?, link = ?, priority = ? WHERE id = ?`;
  db.query(sql, [item_name, description, link, priority, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item updated' });
  });
});

// Delete an item
app.delete('/wishlist/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM wishlist_items WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
