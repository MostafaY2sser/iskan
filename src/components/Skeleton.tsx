const PropertiesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
      >
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

export default PropertiesSkeleton;