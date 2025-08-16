'use client';

import { groceryItemsApi } from '@/lib/api';
import { useState } from 'react';

interface AddItemProps {
  groceryListId: number;
  onAdd: () => void;
}

export default function AddItem({ groceryListId, onAdd }: AddItemProps) {
  const [itemName, setItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) return;

    setIsLoading(true);
    try {
      const response = await groceryItemsApi.create(groceryListId, {
        name: itemName.trim()
      });
      
      if (response.success) {
        setItemName('');
        onAdd();
      } else {
        console.error('Failed to add item:', response.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Add new item..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !itemName.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Adding...
          </div>
        ) : (
          'Add Item'
        )}
      </button>
    </form>
  );
}
