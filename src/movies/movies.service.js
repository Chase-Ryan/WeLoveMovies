const knex = require("../db/connection");
const addCritic = require("../utils/addCritic");

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
    .distinct("m.movie_id")
    .select("m.*")
    .orderBy("m.movie_id");
}

function listTheaters(movie_id) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.*")
    .where({ "m.movie_id": movie_id });
}

function listReviews(movie_id) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "*",
      "c.critic_id as c_critic_id",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at"
    )
    .where({ "m.movie_id": movie_id })
    .then((reviews) => reviews.map(addCritic));
}

function read(movie_id) {
  return knex("movies as m").select("*").where({ movie_id }).first();
}

module.exports = {
  list,
  listShowing,
  listTheaters,
  listReviews,
  read,
};
