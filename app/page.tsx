'use client';

import { useState, useEffect } from 'react';
import { GroceryList } from '@/types/grocery';
import { groceryListsApi } from '@/lib/api';
import GroceryListCard from '@/components/GroceryListCard';
import AddList from '@/components/AddList';

export default function Home() {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroceryLists = async () => {
    try {
      setError(null);
      const response = await groceryListsApi.getAll(true); // Include items for progress calculation
      
      if (response.success && response.data) {
        setGroceryLists(response.data);
      } else {
        setError(response.message || 'Failed to fetch grocery lists');
      }
    } catch (err) {
      console.error('Error fetching grocery lists:', err);
      setError('Error fetching grocery lists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceryLists();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your grocery lists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Lists</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchGroceryLists}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Grocery Lists
          </h1>
          <p className="text-gray-600">
            Organize your shopping with smart grocery lists
          </p>
        </div>

        {/* Stats */}
        {groceryLists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{groceryLists.length}</div>
              <div className="text-gray-600">Total Lists</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {groceryLists.reduce((sum, list) => sum + (list.items?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {groceryLists.reduce((sum, list) => sum + (list.items?.filter(item => item.purchased).length || 0), 0)}
              </div>
              <div className="text-gray-600">Completed Items</div>
            </div>
          </div>
        )}

        {/* Grocery Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New List Card */}
          <AddList onAdd={fetchGroceryLists} />
          
          {/* Existing Lists */}
          {groceryLists.map((groceryList) => (
            <GroceryListCard 
              key={groceryList.id} 
              groceryList={groceryList} 
              onUpdate={fetchGroceryLists} 
            />
          ))}
        </div>

        {/* Empty State */}
        {groceryLists.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No grocery lists yet</h3>
            <p className="text-gray-600 mb-6">Create your first grocery list to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
