import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import { latestArticles } from '../data/mockData';

const ArticlesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = ['all', 'Exams', 'Tips', 'Courses', 'Trends'];
  
  const filteredArticles = activeCategory === 'all'
    ? latestArticles
    : latestArticles.filter(article => article.category === activeCategory);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-2">
            <FileText className="w-6 h-6 mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold">Career Articles</h1>
          </div>
          <p className="text-blue-100">
            Stay updated with the latest career guidance and educational insights
          </p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {activeCategory === 'all' && (
        <div className="container mx-auto px-4 py-6">
          {latestArticles.filter(article => article.isFeatured).map(article => (
            <ArticleCard key={article.id} article={article} featured={true} />
          ))}
        </div>
      )}

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles
            .filter(article => !article.isFeatured || activeCategory !== 'all')
            .map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;