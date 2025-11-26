import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import ArticleCard from "../components/articles/ArticleCard";
import { SearchFilter, ActiveFilters } from "../components/common/FilterPanel";
import { useSearch } from "../hooks/useFilteredData";
import axios from "axios";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "all",
    "Exams",
    "Tips",
    "Courses",
    "Trends",
    "Scholarships",
  ];

  const [filters, setFilters] = useState({
    category: "all",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/articles`
        );
        setArticles(res.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const { searchResults, searchTerm, updateSearchTerm, clearSearch } =
    useSearch(articles, ["title", "description", "category"], 300);

  const filteredArticles = searchResults.filter((article) =>
    filters.category === "all" ? true : article.category === filters.category
  );

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ category: "all" });
    clearSearch();
  };

  const hasActiveFilters = filters.category !== "all" || searchTerm;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading articles...
      </div>
    );
  }

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
            Stay updated with the latest career guidance and educational
            insights
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchFilter
          value={searchTerm}
          onChange={updateSearchTerm}
          placeholder="Search articles by title, description..."
          className="max-w-md"
        />
      </div>

      {/* Category Selection */}
      <div className="container mx-auto px-4 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange("category", category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.category === category
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Articles" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="container mx-auto px-4 pb-4">
          <ActiveFilters
            filters={{
              category: filters.category !== "all" ? filters.category : "",
            }}
            filterLabels={{ category: "Category" }}
            onRemoveFilter={(key) => handleFilterChange(key, "all")}
            onClearAll={handleClearFilters}
          />
        </div>
      )}

      {/* Featured Article */}
      {filters.category === "all" && !searchTerm && (
        <div className="container mx-auto px-4 py-6">
          {articles
            .filter((article) => article.isFeatured)
            .map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                featured={true}
              />
            ))}
        </div>
      )}

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredArticles.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(
                  (article) => !article.isFeatured || filters.category !== "all"
                )
                .map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No articles found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
