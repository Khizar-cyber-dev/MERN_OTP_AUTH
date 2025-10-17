import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './route/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(distDir));
  console.log("Serving static files from:", distDir);

  app.use((req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, async ()  => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});