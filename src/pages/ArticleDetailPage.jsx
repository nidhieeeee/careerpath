import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import axios from 'axios';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/articles/${id}`);
        setArticle(res.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading article...
      </div>
    );
  }

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
              <span>
                {new Date(article.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{article.category}</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose max-w-none whitespace-pre-line">
            {article.content}
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