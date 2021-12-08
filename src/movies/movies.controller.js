const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const validMovie = await moviesService.read(movieId);

  if (validMovie) {
    res.locals.movie = validMovie;
    return next();
  } else {
    next({
      status: 404,
      message: "Movie cannot be found",
    });
  }
}

async function list(req, res) {
  const { is_showing } = req.query;
  let data = is_showing
    ? await moviesService.listShowing()
    : await moviesService.list();
  res.json({ data });
}

async function listTheaters(req, res) {
  const { movie } = res.locals;
  const data = await moviesService.listTheaters(movie.movie_id);
  res.json({ data });
}

async function listReviews(req, res) {
  const { movie } = res.locals;
  const data = await moviesService.listReviews(movie.movie_id);
  res.json({ data });
}

async function read(req, res) {
  const { movie } = res.locals;
  const data = await moviesService.read(movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
