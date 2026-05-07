"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/services/api-client";

export function ReviewComposer({
  productId,
  reviews
}: {
  productId: string;
  reviews: Array<Record<string, any>>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const existingReview = useMemo(
    () =>
      reviews.find(
        (review) => String(review.userId?._id || review.userId || "") === String(user?.id || "")
      ),
    [reviews, user?.id]
  );
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <CardTitle className="text-2xl">{existingReview ? "Edit your review" : "Write a review"}</CardTitle>
          <CardDescription>Your feedback helps other students and makers choose the right build.</CardDescription>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant={rating === value ? "default" : "outline"}
              size="sm"
              onClick={() => setRating(value)}
            >
              {value}
            </Button>
          ))}
        </div>
        <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share product quality, documentation, packaging, or overall buying experience." />
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={async () => {
              try {
                await apiRequest("/api/reviews", {
                  method: "POST",
                  body: JSON.stringify({
                    productId,
                    rating,
                    comment
                  })
                });
                toast.success(existingReview ? "Review updated." : "Review submitted.");
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to submit review.");
              }
            }}
          >
            {existingReview ? "Update review" : "Submit review"}
          </Button>
          {existingReview ? (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                try {
                  await apiRequest(`/api/reviews/${existingReview._id}`, {
                    method: "DELETE"
                  });
                  toast.success("Review deleted.");
                  router.refresh();
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to delete review.");
                }
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
