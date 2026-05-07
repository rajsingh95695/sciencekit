import mongoose from "mongoose";

import Product from "@/models/Product";
import Review from "@/models/Review";

export async function syncProductRatings(productId: string) {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId)
      }
    },
    {
      $group: {
        _id: "$productId",
        ratings: {
          $avg: "$rating"
        },
        reviewsCount: {
          $sum: 1
        }
      }
    }
  ]);

  const summary = stats[0] || {
    ratings: 0,
    reviewsCount: 0
  };

  await Product.findByIdAndUpdate(productId, {
    ratings: Number((summary.ratings || 0).toFixed(1)),
    reviewsCount: summary.reviewsCount || 0
  });
}
