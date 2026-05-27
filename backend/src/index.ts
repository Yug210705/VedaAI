import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initWebSocket } from './websocket';
import assignmentsRouter from './routes/assignments';
import classesRouter from './routes/classes';
import libraryRouter from './routes/library';
import notificationsRouter from './routes/notifications';
import userRouter from './routes/user';
import organizationRouter from './routes/organization';
import integrationRouter from './routes/integration';
import billingRouter from './routes/billing';
import analyticsRouter from './routes/analytics';
import studentsRouter from './routes/students';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/assignments', assignmentsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/library', libraryRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/user', userRouter);
app.use('/api/org', organizationRouter);
app.use('/api/integrations', integrationRouter);
app.use('/api/billing', billingRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/students', studentsRouter);

// Initialize DB and Server
async function startServer() {
  try {
    // Connect to real MongoDB Atlas using URI from .env
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vedaai';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB Atlas successfully!`);

    // Initialize WebSockets
    initWebSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
