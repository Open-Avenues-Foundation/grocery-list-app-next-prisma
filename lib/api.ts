import { 
  GroceryList, 
  GroceryListItem, 
  ApiResponse, 
  CreateGroceryListRequest, 
  UpdateGroceryListRequest,
  CreateGroceryItemRequest,
  UpdateGroceryItemsRequest
} from '@/types/grocery';

const API_BASE = '/api';

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  return data;
}

// Grocery Lists API
export const groceryListsApi = {
  // Get all grocery lists
  getAll: async (includeItems = false): Promise<ApiResponse<GroceryList[]>> => {
    const response = await fetch(`${API_BASE}/grocery_list?include_items=${includeItems}`);
    return handleApiResponse<GroceryList[]>(response);
  },

  // Get a specific grocery list
  getById: async (id: number, includeItems = true): Promise<ApiResponse<GroceryList>> => {
    const response = await fetch(`${API_BASE}/grocery_list/${id}?include_items=${includeItems}`);
    return handleApiResponse<GroceryList>(response);
  },

  // Create a new grocery list
  create: async (data: CreateGroceryListRequest): Promise<ApiResponse<GroceryList>> => {
    const response = await fetch(`${API_BASE}/grocery_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<GroceryList>(response);
  },

  // Update a grocery list
  update: async (id: number, data: UpdateGroceryListRequest): Promise<ApiResponse<GroceryList>> => {
    const response = await fetch(`${API_BASE}/grocery_list/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<GroceryList>(response);
  },

  // Delete a grocery list
  delete: async (id: number): Promise<ApiResponse<GroceryList>> => {
    const response = await fetch(`${API_BASE}/grocery_list/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse<GroceryList>(response);
  },
};

// Grocery Items API
export const groceryItemsApi = {
  // Get all items for a grocery list
  getAll: async (groceryListId: number, purchased?: boolean): Promise<ApiResponse<GroceryListItem[]>> => {
    let url = `${API_BASE}/grocery_list/${groceryListId}/items`;
    if (purchased !== undefined) {
      url += `?purchased=${purchased}`;
    }
    const response = await fetch(url);
    return handleApiResponse<GroceryListItem[]>(response);
  },

  // Add a new item to a grocery list
  create: async (groceryListId: number, data: CreateGroceryItemRequest): Promise<ApiResponse<GroceryListItem>> => {
    const response = await fetch(`${API_BASE}/grocery_list/${groceryListId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<GroceryListItem>(response);
  },

  // Update items in a grocery list (bulk operation)
  updateBulk: async (groceryListId: number, data: UpdateGroceryItemsRequest): Promise<ApiResponse<{ updatedCount: number; groceryListId: number }>> => {
    const response = await fetch(`${API_BASE}/grocery_list/${groceryListId}/items`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<{ updatedCount: number; groceryListId: number }>(response);
  },

  // Delete items from a grocery list
  delete: async (groceryListId: number, options: {
    itemIds?: number[];
    deleteAll?: boolean;
    deletePurchased?: boolean;
  } = {}): Promise<ApiResponse<{ deletedCount: number; groceryListId: number }>> => {
    let url = `${API_BASE}/grocery_list/${groceryListId}/items`;
    const params = new URLSearchParams();

    if (options.deleteAll) {
      params.append('all', 'true');
    } else if (options.deletePurchased) {
      params.append('purchased', 'true');
    } else if (options.itemIds && options.itemIds.length > 0) {
      params.append('item_ids', options.itemIds.join(','));
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
    });
    return handleApiResponse<{ deletedCount: number; groceryListId: number }>(response);
  },
};
