import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import InstituteCard from '../components/institutes/InstituteCard';
import useDataStore from '../store/useDataStore';
import { useEffect } from 'react';


const InstitutesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { institutes, fetchInstitutes, loading } = useDataStore();

  useEffect(() => {
    if (institutes.length === 0) fetchInstitutes();
  }, [institutes.length, fetchInstitutes]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Top Educational Institutes</h1>
          <p className="text-blue-100">
            Find the best colleges and universities for your career goals
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All States</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All Types</option>
                  <option value="engineering">Engineering</option>
                  <option value="medical">Medical</option>
                  <option value="management">Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Any Affiliation</option>
                  <option value="aicte">AICTE</option>
                  <option value="ugc">UGC</option>
                  <option value="autonomous">Autonomous</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-900">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Institute Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((institute) => (
            <InstituteCard key={institute._id} institute={institute} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstitutesPage;