const Movie = require('../models/movie');

const InvalidDataError = require('../errors/invalid-data-err');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(new AccessDeniedError('Извините, но Вы не можете удалить чужой фильм'));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Фильм удалён' }));
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректный идентификатор фильма'));
      } else {
        next(err);
      }
    });
};
