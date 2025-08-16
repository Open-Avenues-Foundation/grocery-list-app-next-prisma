export interface GroceryList {
  id: number;
  name: string;
  items?: GroceryListItem[];
}

export interface GroceryListItem {
  id: number;
  name: string;
  purchased: boolean;
  groceryListId: number;
  groceryList?: GroceryList;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

export interface CreateGroceryListRequest {
  name: string;
}

export interface UpdateGroceryListRequest {
  name: string;
}

export interface CreateGroceryItemRequest {
  name: string;
  purchased?: boolean;
}

export interface UpdateGroceryItemsRequest {
  purchased: boolean;
  markAll?: boolean;
  itemIds?: number[];
}
