import { PrismaClient } from '../../../../generated/prisma'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET /api/grocery_list/[id] - Get a specific grocery list by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        message: 'Invalid ID format'
      }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const includeItems = searchParams.get('include_items') !== 'false' // Default to true

    const groceryList = await prisma.groceryList.findUnique({
      where: { id },
      include: {
        items: includeItems ? {
          orderBy: {
            id: 'asc'
          }
        } : false
      }
    })

    if (!groceryList) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      data: groceryList
    })
  } catch (error) {
    console.error('Error fetching grocery list:', error)
    return Response.json({
      success: false,
      message: 'Failed to fetch grocery list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/grocery_list/[id] - Update a specific grocery list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        message: 'Invalid ID format'
      }, { status: 400 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return Response.json({
        success: false,
        message: 'Name is required and must be a string'
      }, { status: 400 })
    }

    const groceryList = await prisma.groceryList.update({
      where: { id },
      data: {
        name: name.trim()
      },
      include: {
        items: true
      }
    })

    return Response.json({
      success: true,
      message: 'Grocery list updated successfully',
      data: groceryList
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }
    
    console.error('Error updating grocery list:', error)
    return Response.json({
      success: false,
      message: 'Failed to update grocery list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/grocery_list/[id] - Delete a specific grocery list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        message: 'Invalid ID format'
      }, { status: 400 })
    }

    // First delete all items in this grocery list, then delete the list
    await prisma.groceryListItem.deleteMany({
      where: { groceryListId: id }
    })

    const groceryList = await prisma.groceryList.delete({
      where: { id }
    })

    return Response.json({
      success: true,
      message: 'Grocery list deleted successfully',
      data: groceryList
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return Response.json({
        success: false,
        message: 'Grocery list not found'
      }, { status: 404 })
    }
    
    console.error('Error deleting grocery list:', error)
    return Response.json({
      success: false,
      message: 'Failed to delete grocery list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}