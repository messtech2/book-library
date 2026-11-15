import express from 'express';
import {routes} from './routes/book.js';


import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});




export default app;
