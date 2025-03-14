import express from 'express';
import mysql from '../config/mysql.js';

const router = express.Router();

//USERS:
router.get('/users', async (req, res) => {
    try {
        const connection = await mysql.getConnection();
        const [rows] = await connection.execute('SELECT * FROM users');
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/users', async (req, res) => {
    const {name, email, password, age} = req.body;
    try{
        const connection = await mysql.getConnection();
        const [result] = await connection.execute('INSERT INTO users (name, email, password, age) VALUES (?,?,?,?)', [name, email, password, age]);
        connection.release();
        res.status(201).json({ id: result.insertId, name, email, password, age });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/user/:id', async (req, res) => {
    const {name, email, password} = req.body;
    const {id} = req.params;
    try {
        const connection = await mysql.getConnection();
        await connection.execute('UPDATE user SET name=?, email=?, password=?, age=? WHERE id=?', [name, email, password, age, id]);
        connection.release();
        res.json({ id, name, email, password, age });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/user/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await mysql.getConnection();
        await connection.execute('DELETE FROM users WHERE id=?', [id]);
        connection.release();
        res.json({ message: 'User supprimé de la DB' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



export default router;
