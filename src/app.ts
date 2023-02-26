import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './app.routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use('/api', router);

app.set('port', port);

export default app;
