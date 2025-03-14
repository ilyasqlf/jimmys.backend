import express from 'express';
import mysql from '../config/mysql.js';

const router = express.Router();

router.get('/ingredient', async (req, res) => {
    try {
        const connection = await mysql.getConnection();
        const [rows] = await connection.execute('SELECT * FROM ingredient');
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/ingredient', async (req, res) => {
    const {nom, quantite_stock} = req.body;
    try{
        const connection = await mysql.getConnection();
        const [result] = await connection.execute('INSERT INTO ingredient (nom, quantite_stock,) VALUES (?,?)', [nom, quantite_stock]);
        connection.release();
        res.status(201).json({ id: result.insertId, nom, quantite_stock});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/ingredient/:id', async (req, res) => {
    const {nom, quantite_stock} = req.body;
    const {id} = req.params;
    try {
        const connection = await mysql.getConnection();
        await connection.execute('UPDATE user SET nom=?, quantite_stock=? WHERE id=?', [nom, quantite_stock, id]);
        connection.release();
        res.json({ id, nom, quantite_stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/ingredient/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await mysql.getConnection();
        await connection.execute('DELETE FROM ingredient WHERE id=?', [id]);
        connection.release();
        res.json({ message: 'ingredient supprimé de la DB' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
