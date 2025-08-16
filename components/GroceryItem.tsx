'use client';

import { GroceryListItem } from '@/types/grocery';
import { groceryItemsApi } from '@/lib/api';
import { useState } from 'react';

interface GroceryItemProps {
  item: GroceryListItem;
  onUpdate: () => void;
}

export default function GroceryItem({ item, onUpdate }: GroceryItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePurchased = async () => {
    setIsLoading(true);
    try {
      const response = await groceryItemsApi.updateBulk(item.groceryListId, {
        purchased: !item.purchased,
        itemIds: [item.id]
      });
      
      if (response.success) {
        onUpdate();
      } else {
        console.error('Failed to update item:', response.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await groceryItemsApi.delete(item.groceryListId, {
        itemIds: [item.id]
      });
      
      if (response.success) {
        onUpdate();
      } else {
        console.error('Failed to delete item:', response.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
      item.purchased 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* Checkbox */}
      <button
        onClick={handleTogglePurchased}
        disabled={isLoading}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
          item.purchased
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-gray-300 hover:border-green-600'
        } disabled:cursor-not-allowed`}
      >
        {item.purchased && (
          <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Item name */}
      <span className={`flex-1 transition-all duration-200 ${
        item.purchased 
          ? 'text-gray-500 line-through' 
          : 'text-gray-900'
      }`}>
        {item.name}
      </span>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:cursor-not-allowed"
        title="Delete item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex-shrink-0">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
