import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Test Prisma connection by querying grocery lists
    const groceryLists = await prisma.groceryList.findMany({
      include: {
        items: true
      }
    })

    return Response.json({
      success: true,
      message: 'Prisma is working!',
      data: groceryLists,
      count: groceryLists.length
    })
  } catch (error) {
    console.error('Prisma error:', error)
    return Response.json({
      success: false,
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
