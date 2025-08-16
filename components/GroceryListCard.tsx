'use client';

import { GroceryList } from '@/types/grocery';
import { groceryListsApi } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';

interface GroceryListCardProps {
  groceryList: GroceryList;
  onUpdate: () => void;
}

export default function GroceryListCard({ groceryList, onUpdate }: GroceryListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(groceryList.name);
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = groceryList.items?.length || 0;
  const purchasedItems = groceryList.items?.filter(item => item.purchased).length || 0;

  const handleSave = async () => {
    if (!editName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await groceryListsApi.update(groceryList.id, { name: editName.trim() });
      if (response.success) {
        setIsEditing(false);
        onUpdate();
      } else {
        console.error('Failed to update grocery list:', response.message);
      }
    } catch (error) {
      console.error('Error updating grocery list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${groceryList.name}"? This will also delete all items in the list.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await groceryListsApi.delete(groceryList.id);
      if (response.success) {
        onUpdate();
      } else {
        console.error('Failed to delete grocery list:', response.message);
      }
    } catch (error) {
      console.error('Error deleting grocery list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(groceryList.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        {isEditing ? (
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
              disabled={isLoading}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                disabled={isLoading || !editName.trim()}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <Link href={`/list/${groceryList.id}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {groceryList.name}
              </h3>
            </Link>
          </div>
        )}
        
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
              title="Edit list name"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        {totalItems > 0 && (
          <span className="text-green-600">
            {purchasedItems}/{totalItems} completed
          </span>
        )}
      </div>

      {totalItems > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      )}

      <div className="mt-4">
        <Link 
          href={`/list/${groceryList.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
