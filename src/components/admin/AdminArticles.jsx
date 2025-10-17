import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../store/useDataStore";
import { useArticles } from "../../hooks/useArticles";
import AdminNavbar from "./AdminNavbar";
import ArticleGrid from "./ArticleGrid";
import ArticleForm from "./ArticleForm";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { Plus, List } from "lucide-react";

const AdminArticles = () => {
  const { role, initializeAuth, isLoggedIn } = useDataStore();
  const { articles, loading, addArticle, updateArticle, deleteArticle } =
    useArticles();

  const [view, setView] = useState("list");
  const [editingArticle, setEditingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
    let success = false;
    if (editingArticle) {
      success = await updateArticle(editingArticle._id, formData);
    } else {
      success = await addArticle(formData);
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
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20 sm:p-6 lg:p-8" ref={topRef}>
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Article Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Create, edit, and manage all articles.
                  </p>
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  <Plus size={20} /> Add Article
                </button>
              </header>
              <main>
                {/* --- USE THE NEW GRID COMPONENT --- */}
                <ArticleGrid
                  articles={articles}
                  loading={loading}
                  onEdit={showFormView}
                  onDelete={handleDelete}
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
                </div>
                <button
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
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
                />
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminArticles;
