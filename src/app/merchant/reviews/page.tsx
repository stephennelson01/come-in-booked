"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Star,
  MessageCircle,
  Loader2,
  Search,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getMyBusinessReviews,
  respondToReview,
  type ReviewWithDetails,
} from "@/actions/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ reviews }: { reviews: ReviewWithDetails[] }) {
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  const total = reviews.length || 1;

  return (
    <div className="space-y-2">
      {distribution.map((item) => (
        <div key={item.rating} className="flex items-center gap-2 text-sm">
          <span className="w-3">{item.rating}</span>
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-muted-foreground">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewWithDetails[]>([]);
  const [averageRating, setAverageRating] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRating, setFilterRating] = React.useState<number | null>(null);

  // Response dialog state
  const [respondingTo, setRespondingTo] = React.useState<ReviewWithDetails | null>(null);
  const [responseText, setResponseText] = React.useState("");
  const [isResponding, setIsResponding] = React.useState(false);

  React.useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    const result = await getMyBusinessReviews();
    if (result.success && result.reviews) {
      setReviews(result.reviews);
      setAverageRating(result.averageRating || 0);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleRespond = async () => {
    if (!respondingTo || !responseText.trim()) return;

    setIsResponding(true);
    const result = await respondToReview({
      review_id: respondingTo.id,
      response: responseText.trim(),
    });

    if (result.success) {
      toast.success("Response posted successfully");
      setRespondingTo(null);
      setResponseText("");
      loadReviews();
    } else {
      toast.error(result.error || "Failed to post response");
    }
    setIsResponding(false);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      !searchQuery ||
      review.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === null || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const pendingResponses = reviews.filter((r) => !r.response).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer feedback
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
            <div className="mt-1">
              <StarRating rating={Math.round(averageRating)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              5-Star Reviews
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reviews.filter((r) => r.rating === 5).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {reviews.length > 0
                ? `${Math.round(
                    (reviews.filter((r) => r.rating === 5).length / reviews.length) * 100
                  )}% of total`
                : "No reviews yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Responses
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingResponses}</div>
            <p className="text-xs text-muted-foreground">
              {pendingResponses > 0 ? "Awaiting your reply" : "All caught up!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of ratings from all reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingDistribution reviews={reviews} />
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Reviews</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={filterRating === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(null)}
                  >
                    All
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFilterRating(filterRating === rating ? null : rating)
                      }
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center">
                <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No reviews found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterRating
                    ? "Try adjusting your filters"
                    : "Reviews from customers will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={review.customer?.avatar_url || undefined}
                          />
                          <AvatarFallback>
                            {(review.customer?.full_name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {review.customer?.full_name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(review.created_at),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.booking?.items?.[0]?.service_name && (
                        <Badge variant="secondary">
                          {review.booking.items[0].service_name}
                        </Badge>
                      )}
                    </div>

                    {review.comment && (
                      <p className="text-muted-foreground">
                        &quot;{review.comment}&quot;
                      </p>
                    )}

                    {review.response ? (
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm font-medium">Your Response:</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {review.response}
                        </p>
                        {review.responded_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Responded{" "}
                            {format(
                              new Date(review.responded_at),
                              "MMM d, yyyy"
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRespondingTo(review);
                          setResponseText("");
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Response Dialog */}
      <Dialog
        open={!!respondingTo}
        onOpenChange={(open) => !open && setRespondingTo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Reply to {respondingTo?.customer?.full_name || "this customer"}&apos;s
              review. Your response will be visible to everyone.
            </DialogDescription>
          </DialogHeader>
          {respondingTo && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={respondingTo.rating} />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(respondingTo.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                {respondingTo.comment && (
                  <p className="mt-2 text-sm">
                    &quot;{respondingTo.comment}&quot;
                  </p>
                )}
              </div>
              <Textarea
                placeholder="Write your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondingTo(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRespond}
              disabled={!responseText.trim() || isResponding}
            >
              {isResponding && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Post Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
