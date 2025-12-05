import React from "react";

// Base Skeleton Component
export const Skeleton = ({ className = "", variant = "rectangular" }) => {
  const baseClasses =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ animation: "shimmer 2s infinite" }}
    />
  );
};

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton variant="text" className="w-3/4" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

// Course Card Skeleton
export const CourseCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-2/3 h-4" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Institute Card Skeleton
export const InstituteCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-32 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-2/3 h-6" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-3/4 h-4" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

// Article Card Skeleton
export const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-full h-6" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-4/5 h-4" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

// Merit List Card Skeleton
export const MeritListCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    </div>
    <Skeleton variant="text" className="w-full h-4" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b">
    {Array(columns)
      .fill(0)
      .map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <Skeleton variant="text" className="w-full" />
        </td>
      ))}
  </tr>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6">
    <div className="flex flex-col items-center space-y-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <Skeleton className="h-8 w-16 rounded" />
      <Skeleton variant="text" className="w-32 h-5" />
      <Skeleton variant="text" className="w-24 h-4" />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
    <Skeleton className="h-8 w-48 rounded" />
    {Array(4)
      .fill(0)
      .map((_, idx) => (
        <div key={idx} className="space-y-2">
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
    <div className="flex gap-4">
      <Skeleton className="h-10 w-32 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-2 md:px-8">
    <div className="max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8 space-y-3">
        <Skeleton className="h-12 w-64 mx-auto rounded" />
        <Skeleton variant="text" className="w-48 h-6 mx-auto" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <StatsCardSkeleton key={idx} />
          ))}
      </div>

      {/* Form Section */}
      <FormSkeleton />
    </div>
  </div>
);

// Page Loader Skeleton
export const PageLoaderSkeleton = () => (
  <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-16">
      <div className="max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-12 w-96 rounded" />
        <Skeleton className="h-6 w-full max-w-2xl rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-12 w-40 rounded-lg mt-6" />
      </div>
    </div>

    {/* Content Section */}
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
      </div>
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array(items)
      .fill(0)
      .map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
        >
          <Skeleton variant="circular" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4 h-5" />
            <Skeleton variant="text" className="w-1/2 h-4" />
          </div>
        </div>
      ))}
  </div>
);

// Detail Page Skeleton
export const DetailPageSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <Skeleton className="h-64 w-full rounded-lg mb-8" />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-5/6 h-4" />
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-4/5 h-4" />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-32 rounded" />
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} variant="text" className="w-full h-4" />
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default {
  Skeleton,
  CardSkeleton,
  CourseCardSkeleton,
  InstituteCardSkeleton,
  ArticleCardSkeleton,
  MeritListCardSkeleton,
  TableRowSkeleton,
  StatsCardSkeleton,
  FormSkeleton,
  DashboardSkeleton,
  PageLoaderSkeleton,
  ListSkeleton,
  DetailPageSkeleton,
};
