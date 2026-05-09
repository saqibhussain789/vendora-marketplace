export const recalculateProductRatings = (product) => {
  const reviews = product.reviews || [];

  product.numReviews = reviews.length;

  if (!reviews.length) {
    product.ratings = 0;
    return product;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  product.ratings = Number((total / reviews.length).toFixed(1));

  return product;
};