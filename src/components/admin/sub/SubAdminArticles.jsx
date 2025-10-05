import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../../store/useDataStore";
import { useArticles } from "../../../hooks/useArticles";
import SubAdminNavbar from "./SubAdminNavbar";
import ArticleGrid from "../ArticleGrid";
import ArticleForm from "../ArticleForm";
import UnauthorizedAccess from "../UnauthorizedAccess";
import { Plus, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubAdminArticles = () => {
  const { role, initializeAuth, isLoggedIn, user } = useDataStore();
  const { articles, loading, addArticle, updateArticle, deleteArticle } =
    useArticles();
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [editingArticle, setEditingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Filter articles by subadmin's institute
  useEffect(() => {
    if (articles && user?.institute) {
      const instituteArticles = articles.filter(
        (article) =>
          article.institute === user.institute ||
          article.instituteId === user.institute
      );
      setFilteredArticles(instituteArticles);
    } else {
      setFilteredArticles(articles || []);
    }
  }, [articles, user]);

  const showFormView = (article = null) => {
    setEditingArticle(article);
    setView("form");
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showListView = () => {
    setEditingArticle(null);
    setView("list");
  };

  const handleSave = async (formData) => {
    setIsSubmitting(true);

    // Add institute information to form data for subadmin
    const submissionData = {
      ...formData,
      institute: user?.institute || formData.institute,
      author: user?.name || formData.author,
      createdBy: user?.id || user?._id,
    };

    let success = false;
    if (editingArticle) {
      success = await updateArticle(editingArticle._id, submissionData);
    } else {
      success = await addArticle(submissionData);
    }
    if (success) {
      showListView();
    }
    setIsSubmitting(false);
  };

  const handleDelete = (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteArticle(articleId);
    }
  };

  if (role === null) {
    return <div className="min-h-screen bg-gray-50" ref={topRef} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l7 6v6c0 5-3.5 9-7 9s-7-4-7-9V8l7-6z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">Redirecting to login page...</p>
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

  if (role !== "sub") {
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <SubAdminNavbar />
      <div
        className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-32"
        ref={topRef}
      >
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Article Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Create, edit, and manage articles for your institute.
                  </p>
                  {user?.institute && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Institute: {user.instituteName || user.institute}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={20} /> Add Article
                </button>
              </header>
              <main>
                <ArticleGrid
                  articles={filteredArticles}
                  loading={loading}
                  onEdit={showFormView}
                  onDelete={handleDelete}
                  isSubAdmin={true}
                />
              </main>
            </div>
          ) : (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editingArticle ? "Edit Article" : "Create New Article"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the details below.
                  </p>
                  {user?.institute && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Institute: {user.instituteName || user.institute}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <List size={20} /> Back to List
                </button>
              </header>
              <main className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <ArticleForm
                  initialData={editingArticle}
                  onSubmit={handleSave}
                  onCancel={showListView}
                  isSubmitting={isSubmitting}
                  isSubAdmin={true}
                  instituteId={user?.institute}
                  instituteName={user?.instituteName}
                />
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubAdminArticles;
