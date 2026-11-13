
import 'dotenv/config';

import express from 'express';

import usersRouter from './routes/users.js';
import errorHandler from './middlewares/errorHandler.js';
import authenticationsRouter from './routes/authentications.js';
import companiesRouter from './routes/companies.js';
import categoriesRouter from './routes/categories.js';
import jobsRouter from './routes/jobs.js';
import applicationsRouter from './routes/applications.js';
import bookmarksRouter from './routes/bookmarks.js';
import profileRouter from './routes/profile.js';
import documentsRouter from './routes/documents.js';
const app = express();

// Middleware JSON
app.use(express.json());


// ROUTES

app.use('/users', usersRouter);
app.use('/authentications', authenticationsRouter);
app.use('/companies', companiesRouter);
app.use('/categories', categoriesRouter);
app.use('/jobs', jobsRouter);
app.use('/applications', applicationsRouter);
app.use('/bookmarks', bookmarksRouter);
app.use('/profile', profileRouter);
app.use('/documents', documentsRouter);

// 404 HANDLER

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Route not found',
  });
});


// ERROR HANDLER

app.use(errorHandler);


// START SERVER

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Server berjalan pada http://${process.env.HOST}:${process.env.PORT}`
  );
});
