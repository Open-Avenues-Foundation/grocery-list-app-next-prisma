# 🛒 Grocery List App

A modern, responsive grocery list application built with Next.js, Prisma, and PostgreSQL. Easily create, manage, and track your grocery lists with a beautiful user interface.

## ✨ Features

- **📋 Multiple Lists**: Create and manage multiple grocery lists
- **✅ Item Management**: Add, edit, check off, and delete grocery items
- **📊 Progress Tracking**: Visual progress bars and statistics
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **📱 Mobile Friendly**: Optimized for both desktop and mobile devices
- **⚡ Real-time Updates**: Instant updates when managing lists and items

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom animations

## 🗂️ Project Structure

```
grocery-list-app-next-prisma/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   └── grocery_list/        # Grocery list endpoints
│   ├── list/[id]/              # Individual list detail pages
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── AddItem.tsx             # Add new item component
│   ├── AddList.tsx             # Add new list component
│   ├── GroceryItem.tsx         # Individual item component
│   └── GroceryListCard.tsx     # List card component
├── lib/                        # Utility functions
│   └── api.ts                  # API client functions
├── types/                      # TypeScript type definitions
│   └── grocery.ts              # Grocery list types
├── prisma/                     # Database schema and migrations
│   └── schema.prisma           # Prisma schema
└── generated/                  # Generated Prisma client
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-list-app-next-prisma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/grocery_db"
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The app uses two main models:

- **GroceryList**: Contains list information (id, name)
- **GroceryListItem**: Contains item information (id, name, purchased status, groceryListId)

## 🔌 API Endpoints

### Grocery Lists
- `GET /api/grocery_list` - Get all grocery lists
- `POST /api/grocery_list` - Create a new grocery list
- `GET /api/grocery_list/[id]` - Get a specific grocery list
- `PUT /api/grocery_list/[id]` - Update a grocery list
- `DELETE /api/grocery_list/[id]` - Delete a grocery list

### Grocery Items
- `GET /api/grocery_list/[id]/items` - Get items for a list
- `POST /api/grocery_list/[id]/items` - Add an item to a list
- `PATCH /api/grocery_list/[id]/items` - Bulk update items
- `DELETE /api/grocery_list/[id]/items` - Delete items from a list

## 🎨 Features in Detail

### List Management
- Create new grocery lists with custom names
- Edit list names inline
- Delete lists (with confirmation)
- View progress statistics

### Item Management
- Add new items to any list
- Mark items as purchased/unpurchased with checkboxes
- Delete individual items
- Bulk operations (mark all complete, clear completed)
- Filter view (show/hide completed items)

### User Experience
- Responsive design that works on all devices
- Smooth animations and transitions
- Loading states for all operations
- Error handling with user-friendly messages
- Keyboard shortcuts (Enter to save, Escape to cancel)

## 🚀 Deployment

The app can be deployed to any platform that supports Next.js:

1. **Vercel** (Recommended)
   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Docker**
   ```bash
   # Build the application
   npm run build
   
   # Create a Docker image
   docker build -t grocery-list-app .
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database management with [Prisma](https://prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)