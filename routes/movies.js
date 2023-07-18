const router = require('express').Router();

const {
  createMovie,
  getCurrentMovies,
  deleteMovie
} = require('../controllers/movies');

const  {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../middlewares/validation');

router.get('/', getCurrentMovies);
router.post('/',validationCreateMovie, createMovie );
router.delete('/:id', validationDeleteMovie, deleteMovie);

module.exports = router;
