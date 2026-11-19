import express from 'express';
import {routes} from './routes/book.js';
import { authRoutes} from './routes/auth.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api', authRoutes);
app.use('/api', routes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});




export default app;
