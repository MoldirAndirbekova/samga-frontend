"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";




export default function ProductPage() {
    
    const [arrowAnim, setArrowAnim] = useState(null);

    useEffect(() => {
      fetch("/lottie/arrow.json")
        .then((res) => res.json())
        .then((data) => setArrowAnim(data));
    }, []);
  

  const gameImages = [
    "/draw_it.png",
    "/tennis.png",
    "/friut_slice.png",
    "/bubble_pop.png",
    "/draw_it.png",
  ];
  
 

  return (
    <section className="w-full flex flex-col items-center px-4 py-12">
      <div className="bg-[#8B5CF6] rounded-[25px] max-w-7xl w-full px-6 sm:px-12 py-12">
        <h2 className="text-4xl sm:text-8xl font-extrabold text-white drop-shadow-lg mb-10">
          WHY US?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-16">
          <div className="flex flex-col items-start">
            <Image src="/svg/hospital.svg" alt="Hospital" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">Clinically Proven Excellence</h3>
            <p className="text-sm leading-relaxed">
              Select Samga for our clinically validated AR games that offer genuine advantages,
              including improving balance, bolstering self-esteem, and providing practical guidance.
              This results in significant improvements for children with learning differences.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <Image src="/svg/handshake.svg" alt="Handshake" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">By the community, For the community</h3>
            <p className="text-sm leading-relaxed">
              We excel by being community-driven, collaboratively developing solutions with educators,
              therapists, and parents to ensure that every aspect of our platform meets the diverse needs
              of children.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <Image src="/svg/door.svg" alt="Door" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">Accessible Skill Development</h3>
            <p className="text-sm leading-relaxed">
              Every child deserves the opportunity to unlock their potential. Samga is dedicated to
              fostering accessible skill development across all spectrums, making learning enjoyable and
              inclusive, regardless of individual abilities or challenges.
            </p>
          </div>
        </div>

          
        <div className="flex justify-center items-end flex-wrap px-4 sm:px-0">
  {gameImages.map((src, index) => (
    <div
      key={index}
      className={`relative w-[300px] h-[200px] rounded-[20px] 
        overflow-hidden transform transition-all duration-300 ease-in-out 
        ${index % 2 === 0 ? "-rotate-6" : "rotate-6"} 
        ${index !== 0 ? "-ml-1" : ""} 
        z-${10 + index}
        hover:scale-110 hover:z-50 shadow-[0_20px_40px_rgba(0,0,0,1)]`}
    >
      <Image
        src={src}
        alt={`Game ${index + 1}`}
        width={150}
        height={150}
        className="w-full h-full object-cover"
      />
    </div>
  ))}
</div>
  </div>
  

  <div className="w-full max-w-7xl mt-24 px-4">
        <AccordionSection />
      </div>
     
<div className="w-full bg-[#FFF6E2] py-20 px-6 flex justify-center items-center">
  <div className="w-full max-w-7xl bg-[#FDE68A] rounded-3xl shadow-lg border-4 border-[#F59E0B] flex flex-col md:flex-row items-start p-10 gap-8">
    
    <div className="w-full md:w-1/2">
      <h2 className="text-4xl sm:text-5xl font-bold text-[#5C3E00] mb-6 leading-tight">
        HOW CAN <br /> SAMGA HELP YOU?
      </h2>
      <div className="flex justify-end">
  <div className="w-56 h-56">
    <Lottie animationData={arrowAnim} loop autoplay />
  </div>
</div>
    </div>

    
    <div className="w-full md:w-1/2 space-y-6">
      {[
        {
          text: "If you are a parent or educator",
          button: "Start Free Trial Now",
          color: "bg-[#3B82F6] text-white",
        },
        {
          text: "If you are interested in Samga for Institutions",
          button: "Book A Demo Now",
          color: "bg-[#3B82F6] text-white",
        },
        {
          text: "If you wish to help Samga please send an email",
          button: "Email",
          color: "bg-white text-black border border-black",
        },
        {
          text: "If you want to help expand the research",
          button: "Book a meeting now",
          color: "bg-white text-black border border-black",
        },
      ].map((item, idx) => (
        <div key={idx} className="flex justify-between items-center border-b border-[#5C3E00] pb-4">
          <p className="text-md sm:text-lg font-medium text-[#5C3E00] w-2/3">{item.text}</p>
          <button
            className={`ml-4 px-4 py-2 rounded-full font-semibold whitespace-nowrap ${item.color} hover:scale-105 transition`}
          >
            {item.button} →
          </button>
        </div>
      ))}
    </div>
  </div>
</div>

    </section>
    
  );
}


function AccordionSection() {
    const [active, setActive] = useState<string | null>(null);
  
    const toggle = (type: string) => {
      setActive(prev => (prev === type ? null : type));
    };
  
    const sections = [
      {
        title: "MOTOR GAMES",
        color: "bg-[#FACC15]",
        text: "Get ready to boost those physical abilities and coordination skills! Our motor games challenge your child to be active and develop their motor skills. From hand-eye coordination to reflexes, they'll see amazing improvements.",
        image: "/motor.png",
        skills: [
          "Hand-eye coordination",
          "Balance and spatial awareness",
          "Upper body strength",
          "Range of motion",
          "Response Time",
          "Reflexes",
          "Bilateral Movement",
        ],
        id: "motor",
      },
      {
        title: "COGNITIVE GAMES",
        color: "bg-[#3B82F6]",
        text: "Cognitive games enhance your child’s thinking, memory, attention, and problem-solving skills. They’re perfect for building focus and intellectual growth in a fun and engaging way.",
        image: "/cognitive.png",
        skills: [
          "Memory",
          "Focus",
          "Problem-solving",
          "Attention",
          "Planning",
          "Logic",
        ],
        id: "cognitive",
      },
    ];
  
    return (
      <div className="space-y-[-10px] relative z-10">
        {sections.map((section, index) => (
          <div key={section.id} className={`relative z-[${index === 1 ? 50 : 40}]`}>
            <button
              className={`w-full flex justify-between items-center px-6 py-5 text-6xl font-semibold ${section.color} text-black shadow-md rounded-t-xl hover:brightness-105 transition`}
              onClick={() => toggle(section.id)}
            >
              {section.title}
              <span className="text-6xl">{active === section.id ? "−" : "+"}</span>
            </button>
  
            {active === section.id && (
              <div className={`p-6 flex flex-col lg:flex-row gap-6 ${section.color} rounded-b-xl shadow-xl border-t border-black`}>
                <div className="lg:w-1/2">
                  <p className="text-black text-base mb-12 leading-relaxed">{section.text}</p>
                  <div className="flex flex-wrap gap-3">
                    {section.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="border-0 border-black rounded-full px-8 py-1 text-lg font-medium text-black bg-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="rounded-xl overflow-hidden border-0 border-black">
                    <Image
                      src={section.image}
                      alt={section.title}
                      width={400}
                      height={400}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
            )}
          </div>
          
        ))}
        
      </div>
      
      
    );
    
  }
  