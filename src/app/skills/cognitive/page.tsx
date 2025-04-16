"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function CognitiveSkills() {
  return (
    <div className="flex flex-col items-center bg-[#FFF5E1] min-h-screen px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#B8E5FF] rounded-2xl shadow-md p-6 sm:p-12 min-h-[300px] flex flex-col justify-center relative overflow-hidden"
        >
          
          <div className="absolute top-6 right-6 text-blue-600 opacity-20 sm:opacity-30">
            <Brain size={100} />
          </div>

          <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-black z-10">
            SKILLS WE DEVELOP
          </h3>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-600 mb-2 z-10 relative">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow">
              COGNITIVE SKILLS
            </span>
          </h2>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600 z-10 relative">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow">
              REFINEMENT OF MENTAL PROCESSES
            </span>
          </h2>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-md text-base leading-7 text-[#1e1e1e]"
        >
          <h3 className="text-lg font-bold mb-3">
            Samga’s Online Cognitive Games
          </h3>
          <p className="mb-4">
            Online cognitive games for children with special needs are more than just entertainment—they are a powerful tool for enhancing learning and development in an engaging and enjoyable way. From basic memory exercises to intricate puzzles, these interactive games offer children the opportunity to build key life skills, such as cognitive and motor abilities, at their own pace.
          </p>

          <h3 className="text-lg font-bold mb-3">
            Samga’s Interactive Cognitive Games – A Powerful Tool for Learning
          </h3>
          <p className="mb-4">
            If you're seeking interactive online cognitive games for your child, Samga's cognitive games provide a comprehensive solution. Thoughtfully designed with the needs of children with special needs in mind, these games offer more than just fun—they provide unique learning experiences that foster skill development. Explore Samga’s diverse collection of cognitive games, discover how each game promotes growth, and find the perfect match for your child’s needs!
          </p>

          <h3 className="text-lg font-bold mb-3">
            Skills Samga’s Cognitive Games Help Improve in Children with Special Needs
          </h3>
          <p className="mb-4">
            Samga’s cognitive games for children with special needs are specifically designed to make learning both fun and impactful, while supporting the development of vital life skills in a playful, interactive environment. Here’s how Samga’s cognitive games promote growth in crucial areas:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Attention and Focus:</strong> Samga’s cognitive games help improve children’s attention span by encouraging sustained engagement with tasks. Games that require focus and perseverance help enhance their concentration skills and the ability to stay on track.
            </li>
            <li>
              <strong>Critical Thinking and Decision-Making Skills:</strong> Samga’s cognitive games provide valuable opportunities for sharpening cognitive skills like critical thinking and decision-making. Through entertaining challenges, children learn to manage problems independently and make decisions on the fly, which helps strengthen their cognitive abilities.
            </li>
            <li>
              <strong>Motor Skills and Visual Perception:</strong> Samga’s cognitive games are an excellent resource for improving movement coordination and visual responses. By engaging in various game activities, children practice coordination and visual skills in a supportive and enjoyable environment.
            </li>
            <li>
              <strong>Memory Enhancement:</strong> Effective memory skills are essential for learning, and Samga’s cognitive games aim to enhance memory in children with special needs. The interactive and fun nature of the games encourages children to retain and recall information, sharpening their memory while enjoying the process.
            </li>
            <li>
              <strong>Object and Concept Recognition:</strong> From shapes and numbers to letters and symbols, Samga’s games help children improve their object recognition skills. The hands-on, interactive approach helps children better identify and understand objects, making learning enjoyable and effective.
            </li>
          </ul>

          <p className="mt-4">
            Samga’s online cognitive games offer a modern, technology-driven approach to learning that empowers children with special needs to grow, learn, and succeed in a fun, interactive way.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
