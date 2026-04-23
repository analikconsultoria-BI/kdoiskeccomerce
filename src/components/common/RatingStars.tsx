import * as React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number; // 0 to 5
  size?: number;
  className?: string;
}

export const RatingStars = ({ rating, size = 16, className = "" }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf key="half" size={size} className="fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
};
