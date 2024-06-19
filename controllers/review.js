const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

module.exports.createReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  // console.log("review saved");
  req.flash("success", "New Review Created !!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReviews = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  req.flash("success", "Review Deleted !!");
  res.redirect(`/listings/${id}`);
};
