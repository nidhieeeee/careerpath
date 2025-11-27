import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import {
  Search,
  GraduationCap,
  BookOpen,
  Building,
  FileText,
  TrendingUp,
  School,
  FileCheck,
} from "lucide-react";

const floatingTexts = [
  { text: "B.Tech", x: -750, y: -120, depth: 30 },
  { text: "M.Tech", x: -620, y: 200, depth: 22 },
  { text: "PhD", x: -500, y: -120, depth: 25 },
  { text: "B.Sc", x: -400, y: 220, depth: 18 },
  { text: "M.Sc", x: -250, y: -300, depth: 20 },
  { text: "MBA", x: -230, y: 180, depth: 18 },
  { text: "BBA", x: -80, y: -250, depth: 22 },
  { text: "BA", x: 120, y: 100, depth: 35 },
  { text: "M.Com", x: 250, y: -200, depth: 28 },
  { text: "B.Com", x: 370, y: 120, depth: 24 },
  { text: "MA", x: 600, y: -280, depth: 20 },
  { text: "B.Ed", x: 520, y: 230, depth: 30 },
  { text: "DIPLOMA", x: 750, y: -60, depth: 25 },
  { text: "B.Tech", x: -680, y: 40, depth: 20 },
  //   { text: "M.Tech", x: 580, y: -40, depth: 22 },
  { text: "B.A", x: -550, y: 0, depth: 27 },
  { text: "M.A", x: 650, y: 80, depth: 26 },
  { text: "B.Tech", x: -400, y: 80, depth: 15 },
  { text: "PhD", x: 500, y: -140, depth: 28 },
  { text: "B.Sc", x: -250, y: 30, depth: 27 },
  { text: "M.Sc", x: 250, y: 190, depth: 32 },
  { text: "M.Com", x: -120, y: 300, depth: 20 },
  { text: "MBA", x: 120, y: 270, depth: 15 },
  { text: "B.Tech", x: 0, y: 0, depth: 26 },
  { text: "M.Tech", x: 750, y: 220, depth: 22 },
  { text: "BBA", x: -700, y: 150, depth: 20 },
  { text: "BA", x: -400, y: -200, depth: 23 },
  { text: "B.Com", x: 300, y: 50, depth: 28 },
  { text: "M.Sc", x: 150, y: -180, depth: 30 },
  { text: "PhD", x: 100, y: -100, depth: 19 },
  { text: "M.Com", x: 400, y: 250, depth: 18 },
  { text: "M.A", x: -450, y: -250, depth: 22 },
  { text: "B.Tech", x: 200, y: 300, depth: 25 },
  { text: "MBA", x: -600, y: -50, depth: 21 },
  { text: "PhD", x: 400, y: -350, depth: 20 },
  { text: "M.Tech", x: 550, y: 180, depth: 26 },
  { text: "B.Sc", x: 50, y: 120, depth: 17 },
  { text: "M.Com", x: -250, y: 250, depth: 24 },
  { text: "BA", x: 700, y: -200, depth: 30 },
  { text: "PhD", x: -200, y: 50, depth: 23 },
  { text: "B.Tech", x: 600, y: 80, depth: 15 },
  { text: "B.Sc", x: 350, y: 150, depth: 29 },
  { text: "M.A", x: -400, y: 300, depth: 27 },
  { text: "MBA", x: -100, y: -50, depth: 32 },
  { text: "M.Tech", x: -500, y: 100, depth: 18 },
  { text: "DIPLOMA", x: 50, y: -220, depth: 25 },
  { text: "PhD", x: 450, y: -120, depth: 28 },
  { text: "M.Sc", x: 250, y: 50, depth: 21 },
  { text: "B.Ed", x: -650, y: -180, depth: 26 },
  { text: "B.Com", x: -100, y: 100, depth: 19 },
  { text: "B.A", x: 300, y: -50, depth: 20 },
  { text: "M.A", x: 100, y: -300, depth: 29 },
  { text: "PhD", x: -400, y: 50, depth: 17 },
  { text: "B.Tech", x: 550, y: -40, depth: 22 },
  { text: "M.Tech", x: 150, y: 180, depth: 25 },
  { text: "M.Sc", x: -500, y: 200, depth: 20 },
  { text: "MBA", x: -300, y: -250, depth: 24 },
];

// const floatingTexts = [
//   { text: "BSc in Computer Science", x: -750, y: -120, depth: 30 },
//   { text: "MSc in Data Science", x: -620, y: 200, depth: 22 },
//   { text: "BTech in Software Engineering", x: -500, y: -120, depth: 25 },
//   { text: "MBA in Technology Management", x: -400, y: 220, depth: 18 },
//   { text: "PhD in Artificial Intelligence", x: -250, y: -300, depth: 20 },
//   { text: "BSc in Mathematics", x: -230, y: 180, depth: 18 },
//   { text: "MSc in Information Technology", x: -80, y: -250, depth: 22 },
//   { text: "BBA in Management", x: 120, y: 100, depth: 35 },
//   { text: "MBA in Marketing", x: 250, y: -200, depth: 28 },
//   { text: "BSc in Software Development", x: 370, y: 120, depth: 24 },
//   { text: "MSc in Cloud Computing", x: 600, y: -280, depth: 20 },
//   { text: "Diploma in Web Development", x: 520, y: 230, depth: 30 },
//   { text: "Certificate in Cybersecurity", x: 750, y: -60, depth: 25 },
//   { text: "BTech in Electrical Engineering", x: -680, y: 40, depth: 20 },
//   { text: "MTech in Software Engineering", x: 580, y: -40, depth: 22 },
//   { text: "PhD in Robotics", x: -550, y: 0, depth: 27 },
//   { text: "MSc in Network Engineering", x: 650, y: 80, depth: 26 },
//   { text: "BSc in Information Systems", x: -400, y: 80, depth: 15 },
//   { text: "MS in Artificial Intelligence", x: 500, y: -140, depth: 28 },
//   { text: "PhD in Machine Learning", x: -250, y: 30, depth: 27 },
//   { text: "BBA in International Business", x: 250, y: 190, depth: 32 },
//   { text: "MBA in Entrepreneurship", x: -120, y: 300, depth: 20 },
//   { text: "MSc in Business Analytics", x: 120, y: 270, depth: 15 },
//   { text: "BA in Economics", x: 0, y: 0, depth: 26 },
//   { text: "BCom in Accounting", x: 750, y: 220, depth: 22 },
// ];

export default function HeroSection() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen min-w-screen flex items-center justify-center bg-blue-800 overflow-hidden" // Changed bg color to white for light theme
    >
      {floatingTexts.map((item, i) => {
        const offsetX = (mouse.x / item.depth) * -8;
        const offsetY = (mouse.y / item.depth) * -2.5;

        const distanceFromCenter = Math.sqrt(
          Math.pow(item.x + offsetX, 2) + Math.pow(item.y + offsetY, 2)
        );

        const fadeDistance = 400;
        let opacity =
          distanceFromCenter < fadeDistance
            ? (distanceFromCenter / fadeDistance) ** 2
            : 1;

        if (hoveredIndex === i) {
          opacity = 1;
        }

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${item.x}px, ${item.y}px)`,
              pointerEvents: "auto",
              zIndex: 10,
            }}
          >
            <motion.div
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                x: offsetX,
                y: offsetY,
                opacity,
                scale: hoveredIndex === i ? 1.5 : 1,
                rotate: hoveredIndex === i ? 10 : 0, // Add rotation on hover
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="text-base text-opacity-50 font-semibold text-white hover:text-blue-500 hover:bg-blue-100 hover:scale-150 transition-transform duration-[1500ms] ease-out px-3 py-2 rounded-lg"
              style={{ position: "relative", zIndex: 20 }}
            >
              {item.text}
            </motion.div>
          </div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-0 text-center max-w-2xl text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Confused about your career path?
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Explore courses, colleges, and career options to make informed
            decisions about your future.
          </p>
          <div className="flex justify-center pointer-events-none">
            <div className="max-w-md pointer-events-auto">
              <SearchBar />
            </div>
          </div>

          {/* <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link
              to="/after-12th"
              className="bg-gray-400 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <GraduationCap className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">After 12th</span>
            </Link>
            <Link
              to="/after-graduation"
              className="bg-gray-400 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">After Graduation</span>
            </Link>
            <Link
              to="/courses"
              className="bg-gray-400 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <School className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">All Courses</span>
            </Link>
            <Link
              to="/institutes"
              className="bg-gray-400 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <Building className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">Institutes</span>
            </Link>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}
