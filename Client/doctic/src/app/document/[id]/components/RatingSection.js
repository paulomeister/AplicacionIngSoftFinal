import { Button, Slider } from "@nextui-org/react";
import { useState } from "react";

const RatingSection = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = () => {
    onRate(rating);
    setRating(0);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Rate this document</h3>
      <Slider
        color="primary"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min={0}
        max={5}
        step={0.5}
      />
      <p className="text-gray-700 mt-2">Rating: {rating}</p>
      <Button color="primary" onClick={handleRating} disabled={rating === 0} className="mt-2">
        Submit Rating
      </Button>
    </div>
  );
};

export default RatingSection;
