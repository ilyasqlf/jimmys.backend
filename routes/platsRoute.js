import express from 'express';
import mysql from '../config/mysql.js';

const router = express.Router();

router.get('/plats', async (req, res) => {
  try {
    const connection = await mysql.getConnection();
    const [plats] = await connection.execute('SELECT * FROM plats');
    connection.release();
    res.json(plats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/plats', async (req, res) => {
  const { nom, prix, description, imageUrl } = req.body;
  try {
    const connection = await mysql.getConnection();
    const [result] = await connection.execute('INSERT INTO plats (nom, prix, description, imageUrl) VALUES (?, ?, ?, ?)', [nom, prix, description, imageUrl]);
    connection.release();
    res.status(201).json({ id: result.insertId, nom, prix, description, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/plats/:id', async (req, res) => {
  const { nom, prix, description, imageUrl } = req.body;
  const { id } = req.params;
  try {
    const connection = await mysql.getConnection();
    await connection.execute('UPDATE plats SET nom=?, prix=?, description=?, imageUrl=? WHERE id=?', [nom, prix, description, imageUrl, id]);
    connection.release();
    res.json({ id, nom, prix, description, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/plats/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.getConnection();
    await connection.execute('DELETE FROM plats WHERE id=?', [id]);
    connection.release();
    res.json({ message: 'Plat supprimé de la DB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;