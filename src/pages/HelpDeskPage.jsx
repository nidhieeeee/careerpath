import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  BookOpen,
  HelpCircle,
  Award,
  Link2,
  Loader,
} from "lucide-react";

const HelpDeskPage = () => {
  const [activeTab, setActiveTab] = useState("boards");
  const [boards, setBoards] = useState([]);
  const [exams, setExams] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from database/API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simulated API calls - replace with actual backend endpoints
        const boardsData = [
          {
            id: 1,
            board_name: "GSEB",
            official_website: "https://www.gseb.org",
          },
          {
            id: 2,
            board_name: "CBSE",
            official_website: "https://www.cbse.gov.in",
          },
          {
            id: 3,
            board_name: "ICSE / CISCE",
            official_website: "https://www.cisce.org",
          },
          {
            id: 4,
            board_name: "NIOS",
            official_website: "https://www.nios.ac.in",
          },
          {
            id: 5,
            board_name: "Gujarat Technical Board (GTU)",
            official_website: "https://www.gtu.ac.in",
          },
          {
            id: 6,
            board_name: "National Board of Open Schooling",
            official_website: "https://www.nios.ac.in",
          },
          {
            id: 7,
            board_name: "IB Board (International Baccalaureate)",
            official_website: "https://www.ibo.org",
          },
          {
            id: 8,
            board_name: "Cambridge (IGCSE)",
            official_website: "https://www.cambridgeinternational.org",
          },
        ];

        const examsData = [
          {
            id: 1,
            exam_name: "JEE Main",
            category: "Engineering",
            official_website: "https://www.nta.ac.in",
          },
          {
            id: 2,
            exam_name: "JEE Advanced",
            category: "Engineering",
            official_website: "https://jeeadv.ac.in",
          },
          {
            id: 3,
            exam_name: "NEET UG",
            category: "Medical",
            official_website: "https://www.nta.ac.in",
          },
          {
            id: 4,
            exam_name: "GUJCET",
            category: "Engineering/Pharmacy",
            official_website: "https://www.gsebeservice.com",
          },
          {
            id: 5,
            exam_name: "NATA",
            category: "Architecture",
            official_website: "https://www.nata.in",
          },
          {
            id: 6,
            exam_name: "GATE",
            category: "PG Engineering",
            official_website: "https://gate2025.iitm.ac.in",
          },
          {
            id: 7,
            exam_name: "CAT",
            category: "MBA",
            official_website: "https://iimcat.ac.in",
          },
          {
            id: 8,
            exam_name: "CMAT",
            category: "MBA",
            official_website: "https://www.nta.ac.in",
          },
          {
            id: 9,
            exam_name: "CUET UG",
            category: "Central University",
            official_website: "https://cuet.samarth.ac.in",
          },
          {
            id: 10,
            exam_name: "CUET PG",
            category: "PG Entrance",
            official_website: "https://cuet.nta.nic.in",
          },
          {
            id: 11,
            exam_name: "CLAT",
            category: "Law",
            official_website: "https://consortiumofnlus.ac.in",
          },
          {
            id: 12,
            exam_name: "LSAT India",
            category: "Law",
            official_website: "https://www.lsatindia.in",
          },
          {
            id: 13,
            exam_name: "NDA",
            category: "Defence",
            official_website: "https://www.upsc.gov.in",
          },
          {
            id: 14,
            exam_name: "CDS",
            category: "Defence",
            official_website: "https://www.upsc.gov.in",
          },
          {
            id: 15,
            exam_name: "SSC Exams",
            category: "Government Jobs",
            official_website: "https://ssc.nic.in",
          },
          {
            id: 16,
            exam_name: "UPSC CSE",
            category: "Civil Services",
            official_website: "https://www.upsc.gov.in",
          },
        ];

        const admissionsData = [
          {
            id: 1,
            category:
              "Engineering and Pharmacy and MBA and MCA and Architecture",
            authority: "ACPC",
            official_website: "https://acpc.gujarat.gov.in",
          },
          {
            id: 2,
            category: "Diploma Engineering",
            authority: "ACPDC",
            official_website: "https://acpdc.gujarat.gov.in",
          },
          {
            id: 3,
            category: "Medical and Dental and Paramedical",
            authority: "ACPMC",
            official_website: "https://www.medadmgujarat.org",
          },
          {
            id: 4,
            category: "General Courses",
            authority: "GCAS",
            official_website: "https://gcas.gujarat.gov.in",
          },
          {
            id: 5,
            category: "IITs and NITs and IIITs and Central Institutes",
            authority: "NTA",
            official_website: "https://www.nta.ac.in",
          },
          {
            id: 6,
            category: "IITs and NITs and IIITs and Central Institutes",
            authority: "JoSAA",
            official_website: "https://josaa.nic.in",
          },
          {
            id: 7,
            category: "IITs and NITs and IIITs and Central Institutes",
            authority: "CSAB",
            official_website: "https://csab.nic.in",
          },
          {
            id: 8,
            category: "Design Admissions",
            authority: "NID DAT",
            official_website: "https://admissions.nid.edu",
          },
          {
            id: 9,
            category: "Design Admissions",
            authority: "UCEED and CEED",
            official_website: "https://www.uceed.iitb.ac.in",
          },
          {
            id: 10,
            category: "Fashion",
            authority: "NIFT Entrance",
            official_website: "https://www.nift.ac.in",
          },
        ];

        const scholarshipsData = [
          {
            id: 1,
            scholarship_name: "MYSY",
            official_website: "https://www.mysy.guj.nic.in",
          },
          {
            id: 2,
            scholarship_name: "Digital Gujarat",
            official_website: "https://www.digitalgujarat.gov.in",
          },
          {
            id: 3,
            scholarship_name: "National Scholarship Portal",
            official_website: "https://scholarships.gov.in",
          },
          {
            id: 4,
            scholarship_name: "AICTE Pragati (Girls)",
            official_website: "https://www.aicte-pragati-saksham-gov.in",
          },
          {
            id: 5,
            scholarship_name: "AICTE Saksham (Differently Abled)",
            official_website: "https://www.aicte-pragati-saksham-gov.in",
          },
          {
            id: 6,
            scholarship_name: "PMSSS (J&K and Ladakh Students)",
            official_website: "https://www.aicte-jk-scholarship-gov.in",
          },
          {
            id: 7,
            scholarship_name: "Inspire Scholarship (Science)",
            official_website: "https://online-inspire.gov.in",
          },
          {
            id: 8,
            scholarship_name: "NTSE",
            official_website: "https://ncert.nic.in",
          },
          {
            id: 9,
            scholarship_name: "KVPY (Now INSPIRE)",
            official_website: "https://online-inspire.gov.in",
          },
        ];

        setBoards(boardsData);
        setExams(examsData);
        setAdmissions(admissionsData);
        setScholarships(scholarshipsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Table Component
  const ResponsiveTable = ({ data, columns }) => {
    if (isMobile) {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm"
            >
              {columns.map((col) => (
                <div key={col.key} className="mb-3 last:mb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {col.label}
                  </p>
                  {col.key === "official_website" ? (
                    <a
                      href={item[col.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mt-1"
                    >
                      Visit <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p className="text-gray-800 font-medium">{item[col.key]}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {col.key === "official_website" ? (
                      <a
                        href={item[col.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      >
                        Visit <ExternalLink size={16} />
                      </a>
                    ) : (
                      item[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader
            className="animate-spin text-blue-600 mx-auto mb-4"
            size={40}
          />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 md:py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Student Help Desk
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Find important board links, entrance exams, admission portals and
            scholarship resources — always kept updated.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { id: "boards", label: "Board Links", icon: BookOpen },
              { id: "exams", label: "Entrance Exams", icon: Award },
              { id: "admissions", label: "Admission Portals", icon: Link2 },
              { id: "scholarships", label: "Scholarships", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 md:px-6 font-medium text-center transition-all border-b-2 flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600 bg-blue-50"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} className="hidden md:block" />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Board Links */}
        {activeTab === "boards" && (
          <SectionCard title="Board Links" icon={BookOpen}>
            <ResponsiveTable
              data={boards}
              columns={[
                { key: "board_name", label: "Board Name" },
                { key: "official_website", label: "Official Website" },
              ]}
            />
          </SectionCard>
        )}

        {/* Entrance Exams */}
        {activeTab === "exams" && (
          <SectionCard title="Entrance Exams" icon={Award}>
            <ResponsiveTable
              data={exams}
              columns={[
                { key: "exam_name", label: "Exam" },
                { key: "category", label: "Category" },
                { key: "official_website", label: "Website" },
              ]}
            />
          </SectionCard>
        )}

        {/* Admission Portals */}
        {activeTab === "admissions" && (
          <SectionCard title="Admission Portals" icon={Link2}>
            <div className="space-y-8">
              {[
                "Engineering and Pharmacy and MBA and MCA and Architecture",
                "Diploma Engineering",
                "Medical and Dental and Paramedical",
                "General Courses",
                "IITs and NITs and IIITs and Central Institutes",
                "Design Admissions",
                "Fashion",
              ].map((category, idx) => {
                const filteredAdmissions = admissions.filter(
                  (a) => a.category === category
                );
                if (filteredAdmissions.length === 0) return null;
                return (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                      {category}
                    </h3>
                    <ResponsiveTable
                      data={filteredAdmissions}
                      columns={[
                        { key: "authority", label: "Authority" },
                        { key: "official_website", label: "Website" },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Scholarships */}
        {activeTab === "scholarships" && (
          <SectionCard title="Scholarships" icon={HelpCircle}>
            <ResponsiveTable
              data={scholarships}
              columns={[
                { key: "scholarship_name", label: "Scholarship Name" },
                { key: "official_website", label: "Official Website" },
              ]}
            />
          </SectionCard>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 px-4 mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Always Updated
              </h3>
              <p className="text-sm text-gray-600">
                Our database is regularly updated with the latest information
                from official sources.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Award className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Verified Links
              </h3>
              <p className="text-sm text-gray-600">
                All links are verified and directly connect to official
                government portals.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Student Focused
              </h3>
              <p className="text-sm text-gray-600">
                Designed specifically to help students navigate admissions and
                exam processes easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDeskPage;
