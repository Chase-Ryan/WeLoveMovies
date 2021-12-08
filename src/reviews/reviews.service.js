const knex = require("../db/connection");
const addCritic = require("../utils/addCritic");

function list() {
  return knex("reviews").select("*");
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function readReviewCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "*",
      "c.critic_id as c_critic_id",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at"
    )
    .where({ "r.review_id": review_id })
    .first()
    .then(addCritic);
}

function update(updatedReview) {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  read,
  readReviewCritic,
  update,
  delete: destroy,
};
