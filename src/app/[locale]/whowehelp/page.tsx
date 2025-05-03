"use client";

import { useState } from "react";
import Image from "next/image";

const disabilities = [
  {
    title: "Attention Deficit Hyperactive Disorder (ADHD)",
    description: (
      <div className="space-y-4 bg-[#F5C400] p-6 rounded-none">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png"
            alt="Child with ADHD"
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <p className="text-black">
          In the world of special needs education and support, it is crucial to find approaches and
          informational resources that help each child's unique learning style and way of engaging
          with the world. Samğa stands out in this area with its ADHD-sensitive game design,
          offering innovative and personalized solutions.
        </p>
        <h3 className="font-bold text-lg text-black">What is ADHD?</h3>
        <p className="text-black">
          Attention Deficit Hyperactivity Disorder, more commonly known as ADHD, is a
          neurodevelopmental disorder characterized by inattention and hyperactivity in individuals.
        </p>
        <h3 className="font-bold text-lg text-black">Symptoms of ADHD:</h3>
        <ul className="list-disc list-inside text-black">
          <li>Inattention</li>
          <li>Hyperactivity</li>
          <li>Impulsivity</li>
          <li>Disorganization</li>
          <li>Poor time management</li>
          <li>Trouble multitasking</li>
          <li>Frequent mood swings</li>
          <li>Difficulty following through on tasks</li>
          <li>Fidgeting</li>
          <li>Forgetfulness</li>
        </ul>
      </div>
    ),
    color: "#F5C400"
  },
  {
    title: "Autism Spectrum Disorder (ASD)",
    description: (
      <div className="space-y-4 bg-[#4A90F6] p-6 rounded-none text-black">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png"
            alt="Child with ASD"
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <h3 className="font-bold text-lg">Interactive Therapy and Sensory Play Games for Children with Autism</h3>
        <p>
          Samğa offers an engaging platform that encourages children with ASD to actively participate and respond
          to their environment with purpose and intention by offering fun online games for Autism Spectrum Disorder.
        </p>
        <p>
          Our sensory games allow children to improve core skills such as action-reaction, hand-eye coordination,
          spatial awareness, and body awareness.
        </p>
        <h3 className="font-bold text-lg">How Samğa helps children with Autism Spectrum Disorder (ASD):</h3>
        <p>
          Kids with ASD can develop vital skills crucial for daily living. Samğa motivates and supplements
          traditional treatments, improving communication, creativity, and joint attention.
        </p>
        <h3 className="font-bold text-lg">Social Skills Activities:</h3>
        <p>
          These activities ensure autistic individuals understand social cues, communicate effectively,
          and build new relationships with confidence.
        </p>
        <h3 className="font-bold text-lg">Therapeutic Activities for Autistic Teenagers:</h3>
        <p>
          Creative, tailored games help teenagers build motor and communication skills, manage sensory sensitivities,
          and stay motivated through fun.
        </p>
        <h3 className="font-bold text-lg">Skills Children with ASD Develop:</h3>
        <ul className="list-disc list-inside">
          <li>Active participation</li>
          <li>Visual stimulus recognition</li>
          <li>Motor skill coordination</li>
          <li>Communication skills and joint attention</li>
          <li>Sensory integration (visual, auditory, tactile)</li>
          <li>Cognitive development (classification, retention, organization)</li>
        </ul>
        <h3 className="font-bold text-lg">Games for All Ages:</h3>
        <p>
          Samğa games are accessible for all age groups, supporting developmental needs across the autism spectrum.
        </p>
      </div>
    ),
    color: "#4A90F6"
  },  
  {
    title: "Down Syndrome",
    description: (
      <div className="space-y-4 bg-[#FF6B6B] p-6 rounded-none text-black">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png" // You can replace this with a dedicated image for Down Syndrome if desired
            alt="Child with Down Syndrome"
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <h3 className="font-bold text-lg">Sensory Activities and Therapy Games for Kids with Down Syndrome</h3>
        <p>
          Children with Down Syndrome need help improving their fine and gross motor skills.
          Samğa’s interactive games support them in achieving developmental goals that positively impact their daily lives.
        </p>
        <p>
          Games that require hand-eye coordination help strengthen visual-motor integration,
          while balance-based games improve postural stability.
        </p>
  
        <h3 className="font-bold text-lg">How Samğa Helps Children with Down Syndrome:</h3>
        <p>
          Samğa provides a variety of online activities that challenge cognitive abilities.
          Memory games assist in improving both short-term and long-term memory,
          and attention-based tasks enhance focus and sustained engagement.
        </p>
        <p>
          Games using visual and auditory aids help boost language acquisition and support clearer speech development.
        </p>
  
        <h3 className="font-bold text-lg">Skills and Abilities Developed:</h3>
        <ul className="list-disc list-inside">
          <li>Enhanced motor control, accuracy, and efficiency</li>
          <li>Improved clarity of language and speech</li>
          <li>Encouraged expressive communication skills</li>
          <li>Boosted cognitive performance in memory and numeracy</li>
        </ul>
      </div>
    ),
    color: "#FF6B6B"
  },
  {
    title: "Developmental Coordination Disorder (DCD)",
    description: (
      <div className="space-y-4 bg-[#6BCB77] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">Interactive Therapy and Sensory Games for Children with Cerebral Palsy</h3>
        <p>
          Samğa’s online games for cerebral palsy can supplement in-clinic occupational therapy for children with
          Cerebral Palsy. These games provide therapeutic activities for developing both gross and fine motor skills,
          making them an ideal addition to physical and occupational therapy.
        </p>
        <p>
          These games are not only fun but can also be customized to suit children with varying conditions and
          levels of capabilities, offering a great solution for parents and therapists looking for enjoyable
          and effective ways to encourage motor skill development.
        </p>
        <h3 className="font-bold text-lg">How Samğa helps children with Cerebral Palsy</h3>
        <p>
          Games allow adjustment of difficulty levels according to each child’s ability, challenging them to
          expand their range of motion and improve bilateral coordination. Continued practice helps children
          with cerebral palsy develop upper body strength and body awareness, boosting their confidence.
        </p>
        <h3 className="font-bold text-lg">Skills and Abilities Developed:</h3>
        <ul className="list-disc list-inside">
          <li>Improve upper body muscle strength and expand range of motion</li>
          <li>Enhance synchronized movements with greater precision</li>
          <li>Enhance motor control, accuracy and efficiency</li>
          <li>Boost cognitive performance in areas such as classification, retention and arrangement</li>
          <li>Encourage and refine planning and organization of movements, and help regulate balance</li>
        </ul>
      </div>
    ),
    color: "#6BCB77"
  },
  {
    title: "Cerebral Palsy (CP)",
    description: (
      <div className="space-y-4 bg-[#FFA600] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">Interactive Therapy and Sensory Games for Children with Cerebral Palsy</h3>
        <p>
          Samğa’s online games for cerebral palsy can supplement in-clinic occupational therapy. These therapeutic activities help develop both gross and fine motor skills and can be tailored to each child's ability level.
        </p>
        <h3 className="font-bold text-lg">How Samğa helps children with Cerebral Palsy:</h3>
        <p>
          Our games help improve bilateral coordination, expand the range of motion, and develop upper body strength. They also support children with limited mobility, including those in wheelchairs, through adaptive design.
        </p>
        <h3 className="font-bold text-lg">Skills and abilities developed with Samğa:</h3>
        <ul className="list-disc list-inside">
          <li>Improve upper body muscle strength and expand the range of motion</li>
          <li>Enhance synchronized movements with greater precision</li>
          <li>Enhance motor control, accuracy and efficiency</li>
          <li>Boost cognitive performance in classification, retention and arrangement</li>
          <li>Encourage motor planning, balance regulation, and movement organization</li>
        </ul>
      </div>
    ),
    color: "#FFA600"
  },
  {
    title: "Early Childhood Education",
    description: (
      <div className="space-y-4 bg-[#9B51E0] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">Early Childhood Education</h3>
        <p>
          Early childhood is a crucial stage in a child's life, shaping cognitive, physical, and emotional development. Samğa enhances early childhood education through interactive, science-backed learning experiences using AR and AI technologies.
        </p>
        <h3 className="font-bold text-lg">What is Early Childhood Education?</h3>
        <p>
          ECE focuses on foundational learning and development for children from birth to around age eight, preparing them for lifelong learning.
        </p>
        <h3 className="font-bold text-lg">Why is Early Childhood Education Important?</h3>
        <p>
          It lays the foundation for success, improves brain development and social adaptability, and nurtures curiosity and critical thinking.
        </p>
        <h3 className="font-bold text-lg">Benefits of ECE with Samğa:</h3>
        <ul className="list-disc list-inside">
          <li><strong>Cognitive Development:</strong> Enhances memory, attention, problem-solving, and critical thinking.</li>
          <li><strong>Physical Growth:</strong> Improves motor skills, coordination, and overall physical health.</li>
          <li><strong>Social and Emotional Skills:</strong> Builds confidence, communication, and emotional regulation.</li>
          <li><strong>Special Education Support:</strong> Adapts to children’s needs with inclusive game design and real-time tracking for educators and parents.</li>
        </ul>
      </div>
    ),
    color: "#9B51E0"
  }
];

export default function WhoWeHelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#FFF6E2]">
      {/* Intro rectangle */}
      
      <section className="w-full flex flex-col items-center px-4 py-16">
  <div className="bg-[#2959BF] rounded-[25px] max-w-7xl w-full px-6 sm:px-12 py-14 shadow-2xl">
    <h2 className="text-4xl sm:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-16">
      WHO WE HELP
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-white text-center items-stretch">
      
      {/* Card 1 */}
      <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
        <Image src="/svg/brain.svg" alt="Neurodivergent" width={64} height={64} className="mb-5" />
        <h3 className="text-xl font-bold mb-3">Neurodivergent Children</h3>
        <p className="text-sm leading-relaxed">
          Children with ADHD, autism, Down syndrome, and other developmental conditions benefit from therapeutic games that improve attention, social skills, and motor control — all while keeping them engaged and motivated to play and learn.
        </p>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
        <Image src="/svg/growth.svg" alt="Early Learners" width={64} height={64} className="mb-5" />
        <h3 className="text-xl font-bold mb-3">Early Childhood Learners</h3>
        <p className="text-sm leading-relaxed">
          Our platform supports holistic growth in young children, combining AR technology with movement and cognition-based games that enhance early literacy, numeracy, creativity, and problem-solving abilities.
        </p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
        <Image src="/svg/support.svg" alt="Parents & Therapists" width={64} height={64} className="mb-5" />
        <h3 className="text-xl font-bold mb-3">Parents & Therapists</h3>
        <p className="text-sm leading-relaxed">
          Samğa provides caregivers and specialists with measurable insights, adaptive challenges, and enjoyable tools that extend therapy beyond the clinic — making learning consistent, interactive, and goal-driven at home or in care settings.
        </p>
      </div>

    </div>
  </div>
</section>



      {/* Accordion */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-xl overflow-hidden shadow-xl">
          {disabilities.map((item, index) => (
            <div key={index}>
              <button
                className="w-full flex justify-between items-center px-6 py-5 font-extrabold text-xl sm:text-2xl text-black"
                style={{
                  backgroundColor: item.color,
                  borderTopLeftRadius: index === 0 ? "12px" : "0",
                  borderTopRightRadius: index === 0 ? "12px" : "0",
                  borderBottomLeftRadius:
                    index === disabilities.length - 1 && openIndex !== index ? "12px" : "0",
                  borderBottomRightRadius:
                    index === disabilities.length - 1 && openIndex !== index ? "12px" : "0"
                }}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{item.title}</span>
                <span className="text-7xl">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-0 py-0 text-[#444] text-base sm:text-lg leading-relaxed">
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
