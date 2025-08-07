import { PrismaClient } from '../../../generated/prisma'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET /api/grocery_list - Get all grocery lists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeItems = searchParams.get('include_items') === 'true'

    const groceryLists = await prisma.groceryList.findMany({
      include: {
        items: includeItems
      },
      orderBy: {
        id: 'asc'
      }
    })

    return Response.json({
      success: true,
      data: groceryLists,
      count: groceryLists.length
    })
  } catch (error) {
    console.error('Error fetching grocery lists:', error)
    return Response.json({
      success: false,
      message: 'Failed to fetch grocery lists',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/grocery_list - Create a new grocery list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return Response.json({
        success: false,
        message: 'Name is required and must be a string'
      }, { status: 400 })
    }

    const groceryList = await prisma.groceryList.create({
      data: {
        name: name.trim()
      },
      include: {
        items: true
      }
    })

    return Response.json({
      success: true,
      message: 'Grocery list created successfully',
      data: groceryList
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating grocery list:', error)
    return Response.json({
      success: false,
      message: 'Failed to create grocery list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
