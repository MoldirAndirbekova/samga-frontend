import { SetStateAction, useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function Feedback() {
  const [rating, setRating] = useState(4);

  const handleRating = async (newRating: SetStateAction<number>) => {
    setRating(newRating);
  };
  return (
    <div className="flex">
      <main className="flex-1 p-10 bg-[#FFF8E1] flex   text-[#694800]">
        <div>
          <h2 className="text-3xl font-bold mb-7">Feedback</h2>
          <p className="mt-2 text-xl font-bold">
            Go by{" "}
            <Link href="#" className="text-blue-600 underline">
              link
            </Link>{" "}
            and give us feedback!
          </p>
        </div>
        <div className="ml-16 flex flex-col items-center mt-6">
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
          <p className="text-3xl font-bold">
            Our rating is <span className="text-6xl">{rating}.0</span>
          </p>
        </div>
      </main>
    </div>
  );
}
