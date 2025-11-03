import React, { useState } from "react";
import Header from "../components/navigation/Header.jsx";
import Footer from "../components/navigation/Footer.jsx";

import {
  ChevronDown,
  BookOpen,
  FileText,
  Link as LinkIcon,
  Edit,
  UserCheck,
  CheckSquare,
} from "lucide-react";

// Data remains the same as it is content, not style.
const streams = [
  {
    key: "engineering",
    title: "Engineering (B.E./B.Tech)",
    degrees: [
      "B.E. (Bachelor of Engineering)",
      "B.Tech (Bachelor of Technology)",
      "Specializations: Computer Science, Mechanical, Civil, Electrical, IT, Chemical, etc.",
    ],
    exams: [
      { name: "GUJCET", url: "https://gujcet.gseb.org/" },
      { name: "JEE Main", url: "https://jeemain.nta.nic.in/" },
    ],
    admissionBody: {
      name: "Admission Committee for Professional Courses (ACPC)",
      url: "http://www.jacpcldce.ac.in/",
    },
    institutes: [
      {
        name: "Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)",
        location: "Gandhinagar",
        type: "Private",
        university: "DA-IICT University",
        website: "https://www.daiict.ac.in/",
      },
      {
        name: "Nirma University - Institute of Technology",
        location: "Ahmedabad",
        type: "Private",
        university: "Nirma University",
        website: "https://www.nirmauni.ac.in/",
      },
      {
        name: "L.D. College of Engineering",
        location: "Ahmedabad",
        type: "Government",
        university: "Gujarat Technological University",
        website: "https://ldce.ac.in/",
      },
      {
        name: "Sardar Vallabhbhai National Institute of Technology (SVNIT)",
        location: "Surat",
        type: "Government",
        university: "Deemed University",
        website: "https://www.svnit.ac.in/",
      },
    ],
  },
  {
    key: "medical",
    title: "Medical & Paramedical",
    degrees: [
      "MBBS",
      "BDS (Bachelor of Dental Surgery)",
      "B.Pharm",
      "B.Sc. Nursing",
      "BPT (Bachelor of Physiotherapy)",
    ],
    exams: [
      { name: "NEET UG", url: "https://neet.nta.nic.in/" },
      { name: "GUJCET (for Pharmacy)", url: "https://gujcet.gseb.org/" },
    ],
    admissionBody: {
      name: "Gujarat Professional Medical Educational Courses (ACPUGMEC)",
      url: "http://www.medadmgujarat.org/",
    },
    institutes: [
      {
        name: "B.J. Medical College",
        location: "Ahmedabad",
        type: "Government",
        university: "Gujarat University",
        website: "https://www.bjmc.org/",
      },
      {
        name: "Government Medical College",
        location: "Surat",
        type: "Government",
        university: "Veer Narmad South Gujarat University",
        website: "https://www.gmcsurat.edu.in/",
      },
    ],
  },
  {
    key: "commerce",
    title: "Commerce (B.Com)",
    degrees: [
      "B.Com (Bachelor of Commerce)",
      "Specializations: Accounting, Finance, Banking, Taxation, etc.",
    ],
    exams: [{ name: "Direct Admission / Merit-based", url: "#" }],
    admissionBody: {
      name: "Respective Universities (e.g., Gujarat University)",
      url: "https://www.gujaratuniversity.ac.in/",
    },
    institutes: [
      {
        name: "H.L. College of Commerce",
        location: "Ahmedabad",
        type: "Private",
        university: "Gujarat University",
        website: "https://www.hlcollege.edu/",
      },
      {
        name: "M.S. University of Baroda - Faculty of Commerce",
        location: "Vadodara",
        type: "Government",
        university: "Maharaja Sayajirao University",
        website: "https://msubaroda.ac.in/Faculty-of-Commerce",
      },
    ],
  },
  // ... other streams can be added here in the same format
];

const mandatoryDocs = [
  "HSC (12th) Marksheet",
  "School Leaving Certificate",
  "Domicile Certificate",
  "Caste Certificate (if applicable)",
  "Aadhaar Card",
  "Entrance Exam Scorecard",
];
const quickLinks = [
  {
    name: "Admission Committee for Professional Courses (ACPC)",
    url: "http://www.jacpcldce.ac.in/",
  },
  {
    name: "Gujarat Professional Medical Educational Courses (ACPUGMEC)",
    url: "http://www.medadmgujarat.org/",
  },
  { name: "GUJCET Official Website", url: "https://gujcet.gseb.org/" },
  {
    name: "Gujarat Technological University (GTU)",
    url: "https://www.gtu.ac.in/",
  },
  { name: "Gujarat University", url: "https://www.gujaratuniversity.ac.in/" },
  {
    name: "Digital Gujarat Scholarship Portal",
    url: "https://www.digitalgujarat.gov.in/",
  },
];

function AccordionSection({ stream, open, onClick }) {
  // This component's Tailwind styling is already consistent
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm">
      <button
        className={`w-full flex justify-between items-center p-4 text-left font-semibold text-lg transition-colors ${
          open
            ? "bg-blue-50 text-blue-800"
            : "bg-white hover:bg-gray-50 text-gray-800"
        }`}
        onClick={onClick}
        aria-expanded={open}
      >
        <span>{stream.title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="bg-white p-4 md:p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Top Degrees
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {stream.degrees.map((deg, i) => (
                  <li key={i}>{deg}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                Key Entrance Exams
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {stream.exams.map((exam, i) => (
                  <li key={i}>
                    <a
                      href={exam.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {exam.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
              Central Admission Body
            </h3>
            <p>
              <a
                href={stream.admissionBody.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {stream.admissionBody.name}
              </a>
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Top Institutes
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institute Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stream.institutes.map((inst, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inst.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inst.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inst.type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <a
                          href={inst.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuidancePage() {
  const [openAccordion, setOpenAccordion] = useState("engineering"); // Keep the first one open by default

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Gujarat College Admissions 2026
            </h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Your complete guide to navigating the undergraduate admission
              process in Gujarat after your 12th exams.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10">
          {/* Accordions for Streams */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Explore Admissions by Stream
            </h2>
            {streams.map((stream) => (
              <AccordionSection
                key={stream.key}
                stream={stream}
                open={openAccordion === stream.key}
                onClick={() =>
                  setOpenAccordion(
                    openAccordion === stream.key ? null : stream.key
                  )
                }
              />
            ))}
          </section>

          {/* General Information & Resources Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Checklist and Docs */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Admission Process & Documents
              </h2>

              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2 text-green-600" />
                  Step-by-Step Checklist
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>
                    Register for required Entrance Exams (GUJCET, JEE, NEET).
                  </li>
                  <li>
                    Apply for centralized counseling via the admission committee
                    (e.g., ACPC).
                  </li>
                  <li>
                    Participate in choice filling and lock your preferences.
                  </li>
                  <li>Check merit lists and seat allotment results.</li>
                  <li>
                    Report to the allotted institute for document verification
                    and fee payment.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Mandatory Documents
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {mandatoryDocs.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Scholarships and Quick Links */}
            <div className="space-y-8">
              {/* Scholarships Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Key Scholarship Information
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong>MYSY Scheme:</strong> Provides financial aid for
                    tuition, books, and hostel fees.
                    <a
                      href="https://mysy.guj.nic.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2 font-medium"
                    >
                      Learn More
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Digital Gujarat Scholarships:</strong> A state
                    portal for various scholarships for different student
                    categories.
                    <a
                      href="https://www.digitalgujarat.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2 font-medium"
                    >
                      Explore
                    </a>
                  </p>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-blue-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Important Links
                </h2>
                <ul className="space-y-2">
                  {quickLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline text-blue-100 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
