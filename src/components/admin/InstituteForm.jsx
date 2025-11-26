import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

// A default empty state to initialize the form
const initialFormState = {
  name: '',
  imageUrl: '',
  website: '',
  affilication: '',
  location: { city: '', state: '', address: '' },
  courses: [],
  // Added rankings to the initial state according to the schema
  rankings: {
    nirf: [],
    naac: [],
    ariia: [],
    iirf: [],
  },
  isTopInstitute: false,
};

const InstituteForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormState);

  // This effect syncs the form's state with the data passed from the parent.
  useEffect(() => {
    if (initialData) {
      // Deep merge to ensure nested objects like rankings are handled correctly
      const mergedData = {
        ...initialFormState,
        ...initialData,
        location: { ...initialFormState.location, ...(initialData.location || {}) },
        rankings: { ...initialFormState.rankings, ...(initialData.rankings || {}) },
      };
      setFormData(mergedData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: finalValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setFormData((prev) => ({ ...prev, courses: updatedCourses }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [...(prev.courses || []), { name: '', duration: '', fees: '', seats: '', finance_type: 'self' }],
    }));
  };

  const removeCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  // --- New Handlers for Rankings ---
  const handleRankingChange = (rankingType, index, field, value) => {
    setFormData((prev) => {
      const updatedRankings = { ...prev.rankings };
      const rankingsList = [...(updatedRankings[rankingType] || [])];
      rankingsList[index] = { ...rankingsList[index], [field]: value };
      updatedRankings[rankingType] = rankingsList;
      return { ...prev, rankings: updatedRankings };
    });
  };

  const addRanking = (rankingType) => {
    setFormData((prev) => {
      const newEntry = rankingType === 'naac' ? { year: '', grade: '' } : { year: '', rank: '' };
      const updatedRankings = { ...prev.rankings };
      const rankingsList = [...(updatedRankings[rankingType] || []), newEntry];
      updatedRankings[rankingType] = rankingsList;
      return { ...prev, rankings: updatedRankings };
    });
  };

  const removeRanking = (rankingType, index) => {
    setFormData((prev) => {
      const updatedRankings = { ...prev.rankings };
      const rankingsList = (updatedRankings[rankingType] || []).filter((_, i) => i !== index);
      updatedRankings[rankingType] = rankingsList;
      return { ...prev, rankings: updatedRankings };
    });
  };
  // --- End New Handlers ---

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Institute Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Institute Name" value={formData.name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="p-2 border rounded" />
        <input name="location.city" placeholder="City" value={formData.location?.city || ''} onChange={handleChange} required className="p-2 border rounded" />
        <input name="location.state" placeholder="State" value={formData.location?.state || ''} onChange={handleChange} className="p-2 border rounded" />
        <input name="location.address" placeholder="Address" value={formData.location?.address || ''} onChange={handleChange} required className="p-2 border rounded md:col-span-2" />
        <input name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} className="p-2 border rounded" />
        <input name="affilication" placeholder="Affiliation" value={formData.affilication} onChange={handleChange} className="p-2 border rounded" />
      </div>

      {/* Top Institute Toggle */}
      <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-lg">
        <input type="checkbox" id="isTopInstitute" name="isTopInstitute" checked={formData.isTopInstitute || false} onChange={handleChange} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="isTopInstitute" className="font-medium text-gray-700">Mark as Top Institute</label>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-700">Courses</h3>
            <button type="button" onClick={addCourse} className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-semibold">
                + Add Course
            </button>
        </div>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {(formData.courses || []).map((course, idx) => (
            <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input placeholder="Course Name" value={course.name} onChange={(e) => handleCourseChange(idx, 'name', e.target.value)} required className="p-2 border rounded" />
                    <input placeholder="Duration" value={course.duration} onChange={(e) => handleCourseChange(idx, 'duration', e.target.value)} required className="p-2 border rounded" />
                    <input type="number" placeholder="Fees" value={course.fees} onChange={(e) => handleCourseChange(idx, 'fees', e.target.value)} className="p-2 border rounded" />
                    <input type="number" placeholder="Seats" value={course.seats} onChange={(e) => handleCourseChange(idx, 'seats', e.target.value)} className="p-2 border rounded" />
                    <select value={course.finance_type} onChange={(e) => handleCourseChange(idx, 'finance_type', e.target.value)} className="p-2 border rounded md:col-span-2">
                        <option value="self">Self Finance</option>
                        <option value="government">Government</option>
                        <option value="aided">Aided</option>
                    </select>
                </div>
                <div className="text-right mt-2">
                    <button type="button" onClick={() => removeCourse(idx)} className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 ml-auto">
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      {/* --- New Rankings Section --- */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg bg-gray-50">
            {/* NIRF */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-600">NIRF</h4>
                    <button type="button" onClick={() => addRanking('nirf')} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md hover:bg-blue-200">+ Add</button>
                </div>
                {(formData.rankings?.nirf || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input type="number" placeholder="Year" value={item.year} onChange={(e) => handleRankingChange('nirf', idx, 'year', e.target.value)} className="p-2 border rounded w-full" />
                        <input type="number" placeholder="Rank" value={item.rank} onChange={(e) => handleRankingChange('nirf', idx, 'rank', e.target.value)} className="p-2 border rounded w-full" />
                        <button type="button" onClick={() => removeRanking('nirf', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>

            {/* NAAC */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-600">NAAC</h4>
                    <button type="button" onClick={() => addRanking('naac')} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md hover:bg-blue-200">+ Add</button>
                </div>
                {(formData.rankings?.naac || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input type="number" placeholder="Year" value={item.year} onChange={(e) => handleRankingChange('naac', idx, 'year', e.target.value)} className="p-2 border rounded w-full" />
                        <input placeholder="Grade (e.g., A++)" value={item.grade} onChange={(e) => handleRankingChange('naac', idx, 'grade', e.target.value)} className="p-2 border rounded w-full" />
                        <button type="button" onClick={() => removeRanking('naac', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>

            {/* ARIIA */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-600">ARIIA</h4>
                    <button type="button" onClick={() => addRanking('ariia')} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md hover:bg-blue-200">+ Add</button>
                </div>
                {(formData.rankings?.ariia || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input type="number" placeholder="Year" value={item.year} onChange={(e) => handleRankingChange('ariia', idx, 'year', e.target.value)} className="p-2 border rounded w-full" />
                        <input type="number" placeholder="Rank" value={item.rank} onChange={(e) => handleRankingChange('ariia', idx, 'rank', e.target.value)} className="p-2 border rounded w-full" />
                        <button type="button" onClick={() => removeRanking('ariia', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>

            {/* IIRF */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-600">IIRF</h4>
                    <button type="button" onClick={() => addRanking('iirf')} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md hover:bg-blue-200">+ Add</button>
                </div>
                {(formData.rankings?.iirf || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input type="number" placeholder="Year" value={item.year} onChange={(e) => handleRankingChange('iirf', idx, 'year', e.target.value)} className="p-2 border rounded w-full" />
                        <input type="number" placeholder="Rank" value={item.rank} onChange={(e) => handleRankingChange('iirf', idx, 'rank', e.target.value)} className="p-2 border rounded w-full" />
                        <button type="button" onClick={() => removeRanking('iirf', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg disabled:bg-indigo-400">
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Institute' : 'Create Institute')}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InstituteForm;