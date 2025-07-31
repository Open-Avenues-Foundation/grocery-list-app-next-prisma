-- CreateTable
CREATE TABLE "GroceryList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GroceryList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryListItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "groceryListId" INTEGER NOT NULL,

    CONSTRAINT "GroceryListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroceryListItem" ADD CONSTRAINT "GroceryListItem_groceryListId_fkey" FOREIGN KEY ("groceryListId") REFERENCES "GroceryList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
