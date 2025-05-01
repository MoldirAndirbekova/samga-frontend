"use client";
import { SetStateAction, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Feedback() {
  const [rating, setRating] = useState(4);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      setError(true);
    } else {
      setError(false);
      console.log(
        `Feedback submitted! Rating: ${rating}, Comment: ${feedback}`
      );
    }
  };
  const handleRating = async (newRating: SetStateAction<number>) => {
    setRating(newRating);
  };
  return (
    <div className="flex">
      <main className="flex-1 p-10 bg-[#FFF8E1] flex text-[#694800]">
        <div>
          <h2 className="text-3xl font-bold mb-7">Feedback</h2>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-8xl cursor-pointer mb-5 ${
                  i < rating ? "text-[#F9DB63]" : "text-[#DCDCE0]"
                }`}
                onClick={() => handleRating(i + 1)}
              />
            ))}
          </div>
        </div>
        <div className="ml-16 flex flex-col items-center mt-6">
          <div className="bg-transparent p-6 rounded-lg">
            <textarea
              className="w-full p-4 border-2 border-[#694800] rounded-xl bg-[#FFF3C6] text-[#694800] placeholder-[#A67C00] text-lg h-40 shadow-md"
              placeholder="Your insights guide us in making Samga even better."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ resize: "none" }}
            />
            {error && (
              <p className="text-red-600 mt-2 ">⚠️ Feedback is required</p>
            )}
            <Button
              className="mt-4 bg-[#F9DB63] text-[#694800] px-6 py-3 text-lg font-semibold rounded-lg shadow-md"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
