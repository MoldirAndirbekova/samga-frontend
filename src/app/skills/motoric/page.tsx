"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react"; 

export default function MotoricSkills() {
  return (
    <div className="flex flex-col items-center bg-[#FFF5E1] min-h-screen px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        {/* 🔵 Header block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#F7BFC8] rounded-2xl shadow-md p-6 sm:p-12 min-h-[300px] flex flex-col justify-center relative overflow-hidden"
        >
          {/* 🕹️ Motoric icon */}
          <div className="absolute top-6 right-6 text-blue-600 opacity-20 sm:opacity-30">
            <Activity size={100} />
          </div>

          <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-black z-10">
            SKILLS WE DEVELOP
          </h3>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-600 mb-2 z-10 relative">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow">
              MOTOR SKILLS
            </span>
          </h2>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600 z-10 relative">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow">
              IMPROVING COORDINATION AND MOVEMENT
            </span>
          </h2>
        </motion.div>

        {/* ⚪ Content block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-md text-base leading-7 text-[#1e1e1e]"
        >
          <h3 className="text-lg font-bold mb-3">
            Samga’s Motor Skills Games
          </h3>
          <p className="mb-4">
            Samga's online games are designed to develop and improve motor functions in children with special needs. These games target both fine and gross motor skills, helping children to strengthen coordination, balance, and physical awareness.
          </p>

          <h3 className="text-lg font-bold mb-3">
            Fun Meets Physical Development
          </h3>
          <p className="mb-4">
            Through interactive and fun challenges, children can practice movements such as tracing shapes, dragging objects, pressing keys, or imitating motions—supporting the development of essential motor functions in a supportive environment.
          </p>

          <h3 className="text-lg font-bold mb-3">
            Skills Samga’s Motor Games Help Improve:
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Fine Motor Skills:</strong> Activities that involve precision using fingers and hands.</li>
            <li><strong>Gross Motor Skills:</strong> Larger movements involving arms, legs, and body coordination.</li>
            <li><strong>Balance and Posture:</strong> Games that train body awareness and control.</li>
            <li><strong>Hand-Eye Coordination:</strong> Challenges that combine visual cues with precise actions.</li>
            <li><strong>Reaction Time:</strong> Stimulus-response games to improve timing and decision-making.</li>
          </ul>

          <p className="mt-4">
            These games provide an inclusive, low-pressure, and engaging way for kids to develop confidence in their physical abilities.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
