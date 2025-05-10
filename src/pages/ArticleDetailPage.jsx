import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { latestArticles } from '../data/mockData';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const article = latestArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <Link to="/articles" className="text-blue-600 hover:text-blue-800">
            Browse All Articles
          </Link>
        </div>
      </div>
    );
  }

  // For demo purposes, let's create some mock content
  const content = `
    ${article.excerpt}

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    ## Key Points

    1. Understanding the basics
    2. Important considerations
    3. Future prospects
    4. Expert recommendations

    ### Detailed Analysis

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
    in culpa qui officia deserunt mollit anim id est laborum.

    ### Conclusion

    Making informed decisions about your career is crucial. Consider all aspects 
    carefully and choose the path that best aligns with your goals and interests.
  `;

  return (
    <div className="min-h-screen pb-16">
      {/* Header Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <Link
              to="/articles"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Articles
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{article.category}</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose max-w-none">
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)[0].length;
                const text = paragraph.replace(/^#+\s/, '');
                const HeadingTag = `h${level}`;
                return (
                  <HeadingTag
                    key={index}
                    className={`font-bold text-gray-800 ${
                      level === 2 ? 'text-2xl mb-4 mt-8' : 'text-xl mb-3 mt-6'
                    }`}
                  >
                    {text}
                  </HeadingTag>
                );
              }
              return (
                <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Share on Twitter
              </button>
              <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900">
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;