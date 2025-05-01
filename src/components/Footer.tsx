"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F1E1C3] py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
     
        <div className="flex flex-col gap-6 max-w-xs">
          <Image src="/icons/samga_blue.png" alt="Samga logo" width={136} height={40} className="h-10 w-34" />
          <p className="text-lg leading-relaxed">
            Inclusive platform that helps kids<br />
            with motor and cognitive disabilities.
          </p>
          <div className="flex gap-1 text-xl">
            <Image src="/icons/instagram_icon.png" alt="Instagram" width={32} height={32} className="h-8 w-8" />
            <Image src="/icons/youtube_icon.png" alt="YouTube" width={32} height={32} className="h-8 w-8" />
            <Image src="/icons/twitter_icon.png" alt="Twitter" width={32} height={32} className="h-8 w-8" />
            <Image src="/icons/linkedin_icon.png" alt="LinkedIn" width={32} height={32} className="h-8 w-8" />
            <Image src="/icons/facebook_icon.png" alt="Facebook" width={32} height={32} className="h-8 w-8" />
          </div>
        </div>

       
        <div className="text-lg">
          <h3 className="text-[#2F63D3] font-bold mb-3">QUICK LINKS</h3>
          <ul className="space-y-">
            <li>Home</li>
            <li>About Us</li>
            <li>Reviews</li>
            <li>Contact Us</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>

      
        <div className="text-lg">
          <h3 className="text-[#2F63D3] font-bold mb-3">SKILLS WE DEVELOP</h3>
          <ul className="">
            <li>Cognitive skills</li>
            <li>Motor skills</li>
          </ul>
        </div>

        <div className="bg-[#2F63D3] text-white rounded-xl px-6 py-5 w-[300px] shadow-[10px_10px_0px_#00000080]">
  <h2 className="text-base font-bold mb-3">
    DO YOU HAVE QUESTIONS OR SUGGESTIONS?
  </h2>

 
  <input
    type="email"
    placeholder="Enter your email address"
    className="w-full rounded px-3 py-1 text-black bg-white mb-3 outline-none"
  />

  <p className="text-sm font-semibold">We will contact you!</p>
</div>
      </div>
    </footer>
  );
}
