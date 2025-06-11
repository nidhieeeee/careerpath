import React, { useState } from 'react';
import ArticleForm from '../components/admin/ArticleForm';

const AdminArticlesPage = () => {
    const defaultImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg';

    const [articles, setArticles] = useState([
        {
            title: 'How to choose a career after 12th?',
            description: 'A guide to help students pick the right stream.',
            location: 'Career Tips',
            photo: '',
            link: 'https://careerpath.com/article1',
            date: '2025-05-10',
            document: ''
        },
        {
            title: 'Understanding Entrance Exams',
            description: 'Tips and tricks for acing competitive exams.',
            location: 'Exams',
            photo: '',
            link: 'https://careerpath.com/article2',
            date: '2025-06-01',
            document: ''
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [editIndex, setEditIndex] = useState(null);

    const handleEdit = (index) => {
        setFormData(articles[index]);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        const updated = articles.filter((_, i) => i !== index);
        setArticles(updated);
    };

    return (
        <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setShowForm(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    Show Articles
                </button>
                <button
                    onClick={() => {
                        setFormData({});
                        setEditIndex(null);
                        setShowForm(true);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                >
                    Add Article
                </button>
            </div>

            {showForm ? (
                <ArticleForm
                    data={articles}
                    setData={setArticles}
                    editIndex={editIndex}
                    formData={formData}
                    setFormData={setFormData}
                    setEditIndex={setEditIndex}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">No articles added yet.</p>
                    ) : (
                        articles.map((article, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <img
                                        src={article.photo || defaultImage}
                                        alt="Article"
                                        className="w-full md:w-40 h-40 object-cover"
                                    />
                                    <div className="p-4 flex-1">
                                        <h3 className="text-2xl font-bold text-blue-800">{article.title}</h3>
                                        <p className="text-gray-600 mt-1">{article.description}</p>
                                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                                            {article.location && (
                                                <p><span className="font-semibold">📍 Location:</span> {article.location}</p>
                                            )}
                                            {article.date && (
                                                <p><span className="font-semibold">📅 Date:</span> {article.date}</p>
                                            )}
                                            {article.link && (
                                                <a
                                                    href={article.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    🔗 Read Article
                                                </a>
                                            )}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(idx)}
                                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(idx)}
                                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                        {article.document && (
                                            <div className="mt-2">
                                                <a
                                                    href={article.document}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline text-sm"
                                                >
                                                    📄 View Document
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminArticlesPage;
