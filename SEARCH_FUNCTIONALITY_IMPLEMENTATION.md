# Search Functionality Implementation

## Overview
This document describes the implementation of the search functionality for residences in the Iskan React application. The search feature allows users to search for residences by area/city using the API endpoint `/residence/search_by_area`.

## Components Implemented

### 1. useResidenceSearch Hook (`src/hooks/useResidenceSearch.ts`)
A custom React hook that manages search state and API calls:

**Features:**
- Debounced search (300ms delay)
- Loading states
- Error handling
- Clear search functionality

**API Integration:**
- Uses `residencesApi.searchResidencesByArea(area)` endpoint
- Returns `ResidencePublicResponse[]` array

### 2. SearchResults Component (`src/components/SearchResults.tsx`)
A reusable component that displays search results in a dropdown format:

**Features:**
- Compact card layout for each result
- Property image, name, location, and price display
- Click to navigate to residence details
- Loading and error states
- Empty state handling

**Props:**
- `results`: Array of residence objects
- `loading`: Boolean loading state
- `error`: Error message string
- `onResultClick`: Callback when a result is clicked

### 3. Updated Topbar Components
Enhanced the following components with functional search:

#### Topbar (`src/components/dashboard/Topbar.tsx`)
- Added search input with real-time search
- Integrated SearchResults dropdown
- Clear search functionality
- Click outside to close results

#### CustomerTopbar (`src/components/dashboard/CustomerTopbar.tsx`)
- Same functionality as Topbar
- Maintains customer-specific styling

#### DashboardLayout (`src/components/shared/DashboardLayout.tsx`)
- Added search to the main dashboard layout
- Integrated with existing navigation structure

## API Endpoint Details

### Search Residences by Area
- **Endpoint:** `GET /residence/search_by_area`
- **Parameter:** `area` (query parameter)
- **Authentication:** Required (Bearer token)
- **Response:** Array of `ResidencePublicResponse` objects

**Example Request:**
```
GET /residence/search_by_area?area=الرياض
```

**Response Structure:**
```typescript
interface ResidencePublicResponse {
  id: number;
  name: string;
  bed_count: number;
  description: string;
  residence_type: string;
  rooms_count: number;
  kitchen_count: number;
  bathroom_count: number;
  building_year: number;
  address: string;
  city: string;
  price_with_commission: number;
  created_at: string;
  cover_photo_url?: string;
  services: ResidenceServiceDetails[];
}
```

## User Experience Features

### 1. Real-time Search
- Search triggers automatically as user types
- 300ms debounce to prevent excessive API calls
- Loading indicator during search

### 2. Search Results Display
- Dropdown appears below search input
- Compact card layout showing key information
- Property image, name, location, and price
- Click to navigate to full property details

### 3. Search State Management
- Clear search button (X) when text is entered
- Click outside to close results
- Maintains search state during navigation

### 4. Error Handling
- Network error display
- Empty results message
- Loading states

## Implementation Details

### Search Flow
1. User types in search input
2. Debounced search triggers after 300ms
3. API call to `/residence/search_by_area`
4. Results displayed in dropdown
5. User can click result to navigate to property details

### State Management
- Local state for search query
- Hook manages API calls and results
- Component-level state for UI interactions

### Styling
- RTL (Right-to-Left) support
- Responsive design
- Consistent with existing UI components
- Arabic text support

## Testing

### Unit Tests
- Created test file: `src/test/search.test.ts`
- Tests hook initialization and clear functionality
- Mocked API calls for testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to any page with search functionality
3. Type in the search input
4. Verify results appear in dropdown
5. Test navigation to property details
6. Test clear search functionality

## Usage Examples

### Basic Search
```typescript
import { useResidenceSearch } from '@/hooks/useResidenceSearch';

const MyComponent = () => {
  const { searchResults, loading, error, searchResidences, clearSearch } = useResidenceSearch();
  
  const handleSearch = (query: string) => {
    searchResidences(query);
  };
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {searchResults.map(result => (
        <div key={result.id}>{result.name}</div>
      ))}
    </div>
  );
};
```

### Using SearchResults Component
```typescript
import SearchResults from '@/components/SearchResults';

const MySearchComponent = () => {
  return (
    <SearchResults
      results={searchResults}
      loading={loading}
      error={error}
      onResultClick={() => console.log('Result clicked')}
    />
  );
};
```

## Future Enhancements

### Potential Improvements
1. **Advanced Filtering**: Add filters for price range, property type, etc.
2. **Search History**: Remember recent searches
3. **Autocomplete**: Show suggestions as user types
4. **Search Analytics**: Track popular searches
5. **Geolocation Search**: Search by proximity to user location

### Performance Optimizations
1. **Caching**: Cache search results for repeated queries
2. **Pagination**: Load more results on scroll
3. **Virtual Scrolling**: For large result sets
4. **Search Indexing**: Implement client-side search index

## Troubleshooting

### Common Issues
1. **No Results**: Check API endpoint and authentication
2. **Slow Search**: Verify debounce timing
3. **UI Issues**: Check RTL styling and responsive design
4. **Navigation**: Ensure proper routing setup

### Debug Steps
1. Check browser console for errors
2. Verify API calls in Network tab
3. Test with different search terms
4. Check authentication token validity

## Conclusion

The search functionality has been successfully implemented across all major components in the application. Users can now search for residences by area/city with real-time results, proper error handling, and a smooth user experience. The implementation follows React best practices and integrates seamlessly with the existing codebase.
