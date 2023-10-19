import express from 'express';
import {
  getAdmin,
  register,
  login,
  logout
} from '../controllers/AdminController.js';

import {
  getMovies,
  getMovieById,
  saveMovie,
  updateMovie,
  deleteMovie
} from '../controllers/MovieController.js';

const router = express.Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.post('/movies', saveMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

router.get('/getAdmin/:id', getAdmin);
router.post('/register', register);
router.post('/login', login);
router.delete('/logout/:id', logout);

export default router;
