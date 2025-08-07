import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, GraduationCap, ArrowLeft, Phone, Mail, Clock, IndianRupee } from 'lucide-react';
import useDataStore from '../store/useDataStore';

const InstituteDetailPage = () => {
  const { id } = useParams();
  const { institutes, fetchInstitutes, loading } = useDataStore();

  useEffect(() => {
    if (institutes.length === 0) fetchInstitutes();
  }, [institutes.length, fetchInstitutes]);

  const institute = institutes.find((i) => i._id === id);

  if (loading || !institute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {loading ? 'Loading...' : 'Institute Not Found'}
          </h2>
          <Link to="/institutes" className="text-blue-600 hover:text-blue-800">
            Browse All Institutes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <Link
            to="/institutes"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Institutes
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{institute.name}</h1>
          <div className="flex items-center text-blue-100">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{institute.location.city}, {institute.location.state}</span>
          </div>
        </div>
      </div>

      {/* Institute Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">{institute.location.address}</span>
                </div>

                {institute.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-2" />
                    <a
                      href={institute.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {institute.website}
                    </a>
                  </div>
                )}

                {institute.affilication && (
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Affiliation: {institute.affilication}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Courses Offered */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Offered</h2>
              <div className="space-y-4">
                {institute.courses?.map((course, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-800 mb-2">{course.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600">{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600">₹{course.fees?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600">{course.seats || 0} Seats</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">+91 1234567890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">admissions@institute.edu</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Need Guidance?</h3>
              <p className="text-blue-600 mb-4">
                Get help with admission process and course selection
              </p>
              <Link
                to="/contact"
                className="block w-full bg-blue-800 text-white text-center py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDetailPage;
