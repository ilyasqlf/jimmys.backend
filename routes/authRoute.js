import express from 'express';
import mysql from '../config/mysql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

router.post('/register', async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).json({
      status: 'error',
      message: 'Tous les champs sont requis',
    });
  }

  try {
    const connection = await mysql.getConnection();

    const [existingUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({
        status: 'error',
        message: "L'utilisateur existe déjà",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, age]
    );

    connection.release();

    const newUser = { id: result.insertId, name, email };
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.getConnection();

    const [user] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      connection.release();
      return res.status(400).json({
        status: 'error',
        message: 'Utilisateur non trouvé',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      connection.release();
      return res.status(400).json({
        status: 'error',
        message: 'Mot de passe incorrect',
      });
    }

    connection.release();

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie', user: user[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;