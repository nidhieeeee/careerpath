import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer= () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">CareerPath</span>
            </Link>
            <p className="mt-4 text-sm">
              Helping students make informed decisions about their career path with comprehensive 
              resources on courses, colleges, and educational opportunities.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/after-12th" className="text-gray-400 hover:text-white transition-colors">
                  After 12th
                </Link>
              </li>
              <li>
                <Link to="/after-graduation" className="text-gray-400 hover:text-white transition-colors">
                  After Graduation
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/institutes" className="text-gray-400 hover:text-white transition-colors">
                  Institutes
                </Link>
              </li>
              <li>
                <Link to="/merit-list" className="text-gray-400 hover:text-white transition-colors">
                  Merit Lists
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/articles?category=Exams" className="text-gray-400 hover:text-white transition-colors">
                  Exam Resources
                </Link>
              </li>
              <li>
                <Link to="/articles?category=Tips" className="text-gray-400 hover:text-white transition-colors">
                  Career Tips
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail size={16} className="mt-1 mr-2 flex-shrink-0" />
                <span>support@careerpath.info</span>
              </li>
              <li className="flex items-start">
                <Phone size={16} className="mt-1 mr-2 flex-shrink-0" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mt-1 mr-2 flex-shrink-0" />
                <span>123 Education Street, Knowledge City, India - 380001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CareerPath.info. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;