import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoute from './routes/authRoute.js'; // Importer le fichier authRoute.js
import platsRoute from './routes/platsRoute.js'; // Importer le routeur platsRoute

const app = express();
const PORT = process.env.PORT || 8797;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // Autoriser les requêtes depuis localhost:3000
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.use('/', userRoutes);
app.use('/auth', authRoute); // Utiliser les routes d'authentification
app.use('/api', platsRoute); // Utiliser les routes des plats

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});