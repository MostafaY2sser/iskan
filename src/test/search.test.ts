/**
 * Test file for search functionality
 * This is a simple test to verify the search hook works correctly
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResidenceSearch } from '@/hooks/useResidenceSearch';

// Mock the API
vi.mock('@/api/endpoints/residences', () => ({
  residencesApi: {
    searchResidencesByArea: vi.fn(),
  },
}));

describe('useResidenceSearch', () => {
  it('should initialize with empty results', () => {
    const { result } = renderHook(() => useResidenceSearch());
    
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should clear search results when clearSearch is called', () => {
    const { result } = renderHook(() => useResidenceSearch());
    
    act(() => {
      result.current.clearSearch();
    });
    
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
