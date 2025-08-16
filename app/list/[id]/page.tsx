'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GroceryList } from '@/types/grocery';
import { groceryListsApi, groceryItemsApi } from '@/lib/api';
import GroceryItem from '@/components/GroceryItem';
import AddItem from '@/components/AddItem';
import Link from 'next/link';

export default function GroceryListDetail() {
  const params = useParams();
  const router = useRouter();
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const listId = params.id ? parseInt(params.id as string) : null;

  const fetchGroceryList = async () => {
    if (!listId) {
      setError('Invalid list ID');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await groceryListsApi.getById(listId, true);
      
      if (response.success && response.data) {
        setGroceryList(response.data);
      } else {
        setError(response.message || 'Failed to fetch grocery list');
      }
    } catch (err) {
      console.error('Error fetching grocery list:', err);
      setError('Error fetching grocery list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllCompleted = async () => {
    if (!listId || !groceryList?.items) return;

    try {
      const response = await groceryItemsApi.updateBulk(listId, {
        purchased: true,
        markAll: true
      });
      
      if (response.success) {
        fetchGroceryList();
      } else {
        console.error('Failed to mark all items:', response.message);
      }
    } catch (error) {
      console.error('Error marking all items:', error);
    }
  };

  const handleClearCompleted = async () => {
    if (!listId) return;

    if (!confirm('Are you sure you want to delete all completed items?')) {
      return;
    }

    try {
      const response = await groceryItemsApi.delete(listId, {
        deletePurchased: true
      });
      
      if (response.success) {
        fetchGroceryList();
      } else {
        console.error('Failed to clear completed items:', response.message);
      }
    } catch (error) {
      console.error('Error clearing completed items:', error);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, [listId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grocery list...</p>
        </div>
      </div>
    );
  }

  if (error || !groceryList) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-900 mb-2">List Not Found</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Lists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = groceryList.items || [];
  const pendingItems = items.filter(item => !item.purchased);
  const completedItems = items.filter(item => item.purchased);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Back to all lists"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{groceryList.name}</h1>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-blue-600">{items.length}</div>
              <div className="text-gray-600 text-sm">Total Items</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-orange-600">{pendingItems.length}</div>
              <div className="text-gray-600 text-sm">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-green-600">{completedItems.length}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          {items.length > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(completedItems.length / items.length) * 100}%` }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {pendingItems.length > 0 && (
              <button
                onClick={handleMarkAllCompleted}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Mark All Complete
              </button>
            )}
            {completedItems.length > 0 && (
              <>
                <button
                  onClick={handleClearCompleted}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Clear Completed
                </button>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  {showCompleted ? 'Hide' : 'Show'} Completed
                </button>
              </>
            )}
          </div>
        </div>

        {/* Add Item */}
        <div className="mb-8">
          <AddItem groceryListId={groceryList.id} onAdd={fetchGroceryList} />
        </div>

        {/* Items List */}
        <div className="space-y-6">
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shopping List ({pendingItems.length})
              </h2>
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <GroceryItem 
                    key={item.id} 
                    item={item} 
                    onUpdate={fetchGroceryList} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && showCompleted && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Completed ({completedItems.length})
              </h2>
              <div className="space-y-2">
                {completedItems.map((item) => (
                  <GroceryItem 
                    key={item.id} 
                    item={item} 
                    onUpdate={fetchGroceryList} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empty list</h3>
              <p className="text-gray-600">Add your first item to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
