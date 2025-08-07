// pages/ExamsPage.jsx
import React, { act, use, useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import ExamCard from '../components/exams/ExamCard';
import { examsData } from '../data/mockData';
import { useEffect } from 'react';

const ExamsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // useEffect(() => {
  //   console.log(activeCategory);
  //   examsData.forEach(exam => {
  //     console.log(`Type: ${exam.type.toLocaleLowerCase()}`);
  //   });
  // }, [activeCategory]);

  const filteredExams = activeCategory === 'all'
    ? examsData
    : examsData.filter(exam => exam.type.toLowerCase() === activeCategory);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Government & Entrance Exams 2025</h1>
          <p className="text-blue-100">
            Stay updated with the latest and upcoming government and competitive entrance exams.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['all', 'government exam', 'entrance exam'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Exams' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                  Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All Types</option>
                  <option value="government">Government</option>
                  <option value="entrance">Entrance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All Months</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All Levels</option>
                  <option value="national">National</option>
                  <option value="state">State</option>
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

      {/* Exam Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredExams.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No exams found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
