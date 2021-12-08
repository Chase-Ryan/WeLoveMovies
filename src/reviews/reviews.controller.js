const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const validReview = await reviewsService.read(reviewId);

  if (validReview) {
    res.locals.review = validReview;
    return next();
  } else {
    return next({
      status: 404,
      message: "Review cannot be found",
    });
  }
}

async function list(req, res) {
  const data = await reviewsService.list();
  res.json({ data });
}

async function read(req, res) {
  const { review } = res.locals;
  const data = await reviewsService.read(review.review_id);
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await reviewsService.update(updatedReview);
  const data = await reviewsService.readReviewCritic(req.params.reviewId);
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
