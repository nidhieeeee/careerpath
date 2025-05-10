import React from 'react';
import { FileText } from 'lucide-react';
import MeritListCard from '../components/meritList/MeritListCard';
import { latestMeritLists } from '../data/mockData';

const MeritListPage = () => {
  const boards = ['Gujarat Board', 'Maharashtra Board', 'CBSE'];
  const [activeBoard, setActiveBoard] = React.useState(boards[0]);

  const filteredMeritLists = latestMeritLists.filter(
    list => list.board === activeBoard
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-2">
            <FileText className="w-6 h-6 mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold">Merit Lists</h1>
          </div>
          <p className="text-blue-100">
            Access latest merit lists and admission results
          </p>
        </div>
      </div>

      {/* Board Selection */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {boards.map((board) => (
            <button
              key={board}
              onClick={() => setActiveBoard(board)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeBoard === board
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {board}
            </button>
          ))}
        </div>
      </div>

      {/* Merit Lists Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeritLists.map((meritList) => (
            <MeritListCard key={meritList.id} meritList={meritList} />
          ))}
        </div>

        {filteredMeritLists.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No merit lists available for this board.</p>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Important Information</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">How to Check Merit List</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Select your education board from the options above</li>
                <li>Find the relevant merit list from the available options</li>
                <li>Click on download to access the complete list</li>
                <li>Search for your name or roll number in the PDF</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Merit List Schedule</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>First Merit List: June 15, 2025</li>
                <li>Second Merit List: June 25, 2025</li>
                <li>Third Merit List: July 5, 2025</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Need Help?</h3>
              <p className="text-gray-600">
                If you need assistance in understanding the merit list or admission process, 
                feel free to contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeritListPage;