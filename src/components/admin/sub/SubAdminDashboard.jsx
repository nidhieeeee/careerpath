import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../../store/useDataStore";
import SubAdminNavbar from "./SubAdminNavbar";
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  UsersIcon,
  CalendarIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

const skeletonStats = [
  {
    label: "Total Courses Managed",
    value: null,
    icon: BookOpenIcon,
    desc: "Courses managed by the sub-admin",
    color: "bg-green-100 text-green-700",
    loading: true,
  },
  {
    label: "Total Articles Added",
    value: null,
    icon: DocumentTextIcon,
    desc: "Articles added by the sub-admin",
    color: "bg-pink-100 text-pink-700",
    loading: true,
  },
  {
    label: "Total Merit Lists Published",
    value: null,
    icon: AcademicCapIcon,
    desc: "Merit lists published by the sub-admin",
    color: "bg-blue-100 text-blue-700",
    loading: true,
  },
];

export default function SubAdminDashboard() {
  const { isLoggedIn, role, user } = useDataStore();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(skeletonStats);
  const [subAdminInfo, setSubAdminInfo] = useState(null);
  const [instituteInfo, setInstituteInfo] = useState(null);
  const [superAdminInfo, setSuperAdminInfo] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Simulate API calls - fetch stats
    setTimeout(() => {
      setStats([
        {
          label: "Total Courses Managed",
          value: 15,
          icon: BookOpenIcon,
          desc: "Courses managed by the sub-admin",
          color: "bg-green-100 text-green-700",
        },
        {
          label: "Total Articles Added",
          value: 8,
          icon: DocumentTextIcon,
          desc: "Articles added by the sub-admin",
          color: "bg-pink-100 text-pink-700",
        },
        {
          label: "Total Merit Lists Published",
          value: 3,
          icon: AcademicCapIcon,
          desc: "Merit lists published by the sub-admin",
          color: "bg-blue-100 text-blue-700",
        },
      ]);
    }, 1000);

    // Demo data for sub-admin information
    setSubAdminInfo({
      name: "John Doe",
      email: "john.doe@techexcellence.edu.in",
      phone: "+91 98765 43210",
      designation: "Institute SubAdmin",
      department: "Academic Administration",
      joinDate: "January 2023",
      status: "Active"
    });

    // Demo data for institute information
    setInstituteInfo({
      name: "Tech Excellence Institute",
      type: "Private Engineering College",
      establishedYear: "2010",
      location: "Mumbai, Maharashtra",
      address: "123 Tech Park, Andheri East, Mumbai - 400069",
      affiliation: "University of Mumbai",
      accreditation: "NAAC A+ Grade",
      website: "www.techexcellence.edu.in",
      email: "info@techexcellence.edu.in",
      phone: "+91 98765 43210",
      totalStudents: 1250,
      totalFaculty: 85,
      departments: 8,
      ranking: "Top 50 Engineering Colleges in Maharashtra"
    });

    // Demo data for super-admin information
    setSuperAdminInfo({
      name: "Dr. Rajesh Kumar",
      designation: "System Administrator",
      email: "admin@careerpath.com",
      phone: "+91 99999 99999",
      department: "IT Administration",
      status: "Active"
    });

    // Demo recent activities
    setRecentActivities([
      { id: 1, action: "Added new course", title: "Master of Computer Applications", time: "2 hours ago", type: "course" },
      { id: 2, action: "Published article", title: "Career Guidance for Engineering Students", time: "1 day ago", type: "article" },
      { id: 3, action: "Updated merit list", title: "Engineering Entrance Results 2024", time: "3 days ago", type: "merit" },
      { id: 4, action: "Modified course details", title: "Bachelor of Technology", time: "1 week ago", type: "course" },
    ]);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            Redirecting to login page...
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubAdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 pt-36">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sub-Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to your administrative panel - {instituteInfo?.name}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl shadow-lg p-6 flex flex-col items-center ${stat.color} transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                onClick={() => {
                  if (stat.label.includes("Courses")) navigate("/subadmin/courses");
                  else if (stat.label.includes("Articles")) navigate("/subadmin/articles");
                  else if (stat.label.includes("Merit")) navigate("/subadmin/meritlists");
                }}
              >
                <stat.icon className="w-10 h-10 mb-2" />
                <div className="text-3xl font-extrabold mb-1">
                  {stat.value !== null ? stat.value : (
                    <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                  )}
                </div>
                <div className="font-semibold text-lg mb-1 text-center">{stat.label}</div>
                <div className="text-sm text-gray-600 text-center">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Sub-Admin Information */}
            <div className="xl:col-span-1">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    Your Profile
                  </h2>
                  <button
                    onClick={() => navigate("/subadmin/account")}
                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Cog6ToothIcon className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                </div>
                
                {subAdminInfo && (
                  <div className="space-y-4">
                    <div className="text-center pb-6 border-b border-gray-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{subAdminInfo.name}</h3>
                      <p className="text-gray-600">{subAdminInfo.designation}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {subAdminInfo.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                        <p className="text-gray-800 font-medium">{subAdminInfo.email}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <PhoneIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                        <p className="text-gray-800 font-medium">{subAdminInfo.phone}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Joined</p>
                        </div>
                        <p className="text-gray-800 font-medium">{subAdminInfo.joinDate}</p>
                      </div>
                      
                      
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Institute Information */}
            <div className="xl:col-span-2">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  Institute Information
                </h2>
                
                {instituteInfo && (
                  <div className="space-y-6">
                    {/* Basic Institute Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Institute Name</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.name}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Type</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.type}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Established</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.establishedYear}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPinIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Location</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.location}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <StarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Accreditation</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.accreditation}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrophyIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Ranking</p>
                          </div>
                          <p className="text-gray-800 font-semibold">{instituteInfo.ranking}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Email</p>
                          </div>
                          <p className="text-gray-800 font-medium">{instituteInfo.email}</p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <PhoneIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Phone</p>
                          </div>
                          <p className="text-gray-800 font-medium">{instituteInfo.phone}</p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Website</p>
                          </div>
                          <p className="text-gray-800 font-medium">{instituteInfo.website}</p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Institute Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{instituteInfo.totalStudents}</p>
                          <p className="text-sm text-gray-600">Total Students</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{instituteInfo.totalFaculty}</p>
                          <p className="text-sm text-gray-600">Faculty Members</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{instituteInfo.departments}</p>
                          <p className="text-sm text-gray-600">Departments</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">A+</p>
                          <p className="text-sm text-gray-600">NAAC Grade</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Super-Admin Information */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-purple-600" />
                Super-Admin Contact
              </h2>
              
              {superAdminInfo && (
                <div className="space-y-6">
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{superAdminInfo.name}</h3>
                    <p className="text-gray-600">{superAdminInfo.designation}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {superAdminInfo.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                      <p className="text-gray-800 font-medium">{superAdminInfo.email}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                      <p className="text-gray-800 font-medium">{superAdminInfo.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-green-600" />
                Recent Activities
              </h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'course' ? 'bg-blue-100' :
                      activity.type === 'article' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'course' ? <BookOpenIcon className="w-5 h-5 text-blue-600" /> :
                       activity.type === 'article' ? <DocumentTextIcon className="w-5 h-5 text-green-600" /> :
                       <TrophyIcon className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  View All Activities
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/subadmin/courses")}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              >
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Manage Courses</h4>
                  <p className="text-sm text-gray-600">Add, edit, or remove courses</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate("/subadmin/articles")}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              >
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Manage Articles</h4>
                  <p className="text-sm text-gray-600">Create and publish articles</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate("/subadmin/meritlists")}
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
              >
                <TrophyIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Merit Lists</h4>
                  <p className="text-sm text-gray-600">Create and manage merit lists</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
