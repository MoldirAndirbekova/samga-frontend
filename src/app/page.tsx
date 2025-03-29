"use client";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-[#FFF6E2] min-h-screen flex flex-col items-center justify-center sm:flex-row sm:justify-between px-6 sm:px-20 py-10 gap-10 font-sans">
        {/* Left Section */}
        <div className="flex flex-col gap-8 text-[#3C2A00] max-w-md">
          {/* Title */}
          <div className="text-xl sm:text-8xl font-semibold leading-snug space-y-1">
            <p>Welcome</p>
            <p>to</p>
            <Image
              src="/icons/samga_brown.png"
              alt="Samga Logo"
              width={400}
              height={400}
              priority
            />
          </div>

          {/* Action Words */}
          <div className="flex flex-col gap-4 text-lg sm:text-5xl font-semibold mt-2">
            <div className="flex items-center gap-2 ml-0">
              <span className="text-[#F3C100] text-5xl">▶</span>
              <span className="text-[#5A3E16]">Play</span>
            </div>
            <div className="flex items-center gap-2 ml-30">
              <span className="text-[#845EC2] text-5xl">★</span>
              <span className="text-[#5A3E16]">Enjoy</span>
            </div>
            <div className="flex items-center gap-2 ml-60">
              <span className="text-[#2C73D2] text-5xl">◆</span>
              <span className="text-[#5A3E16]">Move</span>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="border-2 border-[#3C2A00] rounded-2xl overflow-hidden shadow-md max-w-[600px]">
          <Image
            src="/image_kids_illustration.png"
            alt="Kids playing illustration"
            width={600}
            height={600}
            className="object-cover"
          />
        </div>
      </div>

    
<div className="relative w-full bg-blue-500 py-2 overflow-hidden">
  <div className="marquee text-white font-bold text-3xl">
  <span>ENJOY</span>
      <span>⭐</span>
      <span>MOVE</span>
      <span>⭐</span>
      <span>PLAY</span>
      <span>⭐</span>
      <span>ENJOY</span>
      <span>⭐</span>
      <span>MOVE</span>
      <span>⭐</span>
      
  </div>
</div>

<style jsx>{`
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  .marquee {
    display: flex;
    width: max-content;
     gap: 90px;
    animation: marquee 10s linear infinite;
    white-space: nowrap;
  }
`}</style>


      {/* Features Section */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-6 sm:px-20 py-16 bg-yellow-400">
        {/* Feature 1 */}
        <div className="flex-1 max-w-sm bg-yellow-500 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Access to Inclusive Spectrum Games</h2>
          <p className="mt-4">
            Our interactive therapy games for children are designed to embrace diversity,
            ensuring that kids of all abilities can join in the fun. With spectrum-accessible
            games, we're fostering a culture of inclusive learning, where every child can shine.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>
        
        {/* Feature 2 */}
        <div className="flex-1 max-w-sm bg-yellow-300 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Live Reporting: Real-Time Progress Insights</h2>
          <p className="mt-4">
            Stay in the know with our real-time progress tracking. Samga keeps you
            updated on your child's development journey, offering valuable insights that
            empower parents, educators, and therapists to make informed decisions.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>

        {/* Feature 3 */}
        <div className="flex-1 max-w-sm bg-yellow-500 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Discover Games</h2>
          <p className="mt-4">
            Uncover a world of captivating games that nurture essential developmental skills
            while making learning an exciting adventure. Watch as your child thrives and grows,
            all while having loads of fun.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>
        
      </div>
     

    </>
    
  );
  
}
