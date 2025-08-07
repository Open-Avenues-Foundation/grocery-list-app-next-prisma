import { PrismaClient } from '../../../../../generated/prisma'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET /api/grocery_list/[id]/items - Get all items for a specific grocery list
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groceryListId = parseInt(params.id)
    
    if (isNaN(groceryListId)) {
      return Response.json({
        success: false,
        message: 'Invalid grocery list ID format'
      }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const purchased = searchParams.get('purchased')

    // Check if grocery list exists
    const groceryListExists = await prisma.groceryList.findUnique({
      where: { id: groceryListId }
    })

    if (!groceryListExists) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }

    let whereClause: any = { groceryListId }
    
    if (purchased !== null) {
      whereClause.purchased = purchased === 'true'
    }

    const items = await prisma.groceryListItem.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc'
      }
    })

    return Response.json({
      success: true,
      data: items,
      count: items.length,
      groceryListId
    })
  } catch (error) {
    console.error('Error fetching grocery list items:', error)
    return Response.json({
      success: false,
      message: 'Failed to fetch grocery list items',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/grocery_list/[id]/items - Add a new item to a specific grocery list
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groceryListId = parseInt(params.id)
    
    if (isNaN(groceryListId)) {
      return Response.json({
        success: false,
        message: 'Invalid grocery list ID format'
      }, { status: 400 })
    }

    const body = await request.json()
    const { name, purchased = false } = body

    if (!name || typeof name !== 'string') {
      return Response.json({
        success: false,
        message: 'Name is required and must be a string'
      }, { status: 400 })
    }

    // Check if grocery list exists
    const groceryListExists = await prisma.groceryList.findUnique({
      where: { id: groceryListId }
    })

    if (!groceryListExists) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }

    const groceryListItem = await prisma.groceryListItem.create({
      data: {
        name: name.trim(),
        groceryListId,
        purchased: Boolean(purchased)
      }
    })

    return Response.json({
      success: true,
      message: 'Item added to grocery list successfully',
      data: groceryListItem
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding item to grocery list:', error)
    return Response.json({
      success: false,
      message: 'Failed to add item to grocery list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PATCH /api/grocery_list/[id]/items - Bulk update items in a specific grocery list
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groceryListId = parseInt(params.id)
    
    if (isNaN(groceryListId)) {
      return Response.json({
        success: false,
        message: 'Invalid grocery list ID format'
      }, { status: 400 })
    }

    const body = await request.json()
    const { purchased, markAll = false, itemIds } = body

    if (typeof purchased !== 'boolean') {
      return Response.json({
        success: false,
        message: 'purchased must be a boolean'
      }, { status: 400 })
    }

    // Check if grocery list exists
    const groceryListExists = await prisma.groceryList.findUnique({
      where: { id: groceryListId }
    })

    if (!groceryListExists) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }

    let whereClause: any = { groceryListId }

    if (markAll) {
      // Update all items in the grocery list
    } else if (itemIds && Array.isArray(itemIds)) {
      // Update specific items
      whereClause.id = { in: itemIds }
    } else {
      return Response.json({
        success: false,
        message: 'Either set markAll to true or provide itemIds array'
      }, { status: 400 })
    }

    const result = await prisma.groceryListItem.updateMany({
      where: whereClause,
      data: { purchased }
    })

    return Response.json({
      success: true,
      message: `Updated ${result.count} items in grocery list`,
      updatedCount: result.count,
      groceryListId
    })
  } catch (error) {
    console.error('Error updating grocery list items:', error)
    return Response.json({
      success: false,
      message: 'Failed to update grocery list items',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/grocery_list/[id]/items - Delete items from a specific grocery list
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groceryListId = parseInt(params.id)
    
    if (isNaN(groceryListId)) {
      return Response.json({
        success: false,
        message: 'Invalid grocery list ID format'
      }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('item_ids')
    const deleteAll = searchParams.get('all') === 'true'
    const deletePurchased = searchParams.get('purchased') === 'true'

    // Check if grocery list exists
    const groceryListExists = await prisma.groceryList.findUnique({
      where: { id: groceryListId }
    })

    if (!groceryListExists) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }

    let whereClause: any = { groceryListId }

    if (deleteAll) {
      // Delete all items in the grocery list (already set in whereClause)
    } else if (deletePurchased) {
      // Delete only purchased items
      whereClause.purchased = true
    } else if (idsParam) {
      // Delete specific items by IDs
      const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      
      if (ids.length === 0) {
        return Response.json({
          success: false,
          message: 'No valid item IDs provided'
        }, { status: 400 })
      }

      whereClause.id = { in: ids }
    } else {
      return Response.json({
        success: false,
        message: 'Specify deletion criteria: all=true, purchased=true, or item_ids=1,2,3'
      }, { status: 400 })
    }

    const result = await prisma.groceryListItem.deleteMany({
      where: whereClause
    })

    return Response.json({
      success: true,
      message: `Deleted ${result.count} items from grocery list`,
      deletedCount: result.count,
      groceryListId
    })
  } catch (error) {
    console.error('Error deleting grocery list items:', error)
    return Response.json({
      success: false,
      message: 'Failed to delete grocery list items',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}