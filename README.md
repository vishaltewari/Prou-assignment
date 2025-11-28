# Employee Task Management SystemThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



**Track 3: Fullstack Web + API + Database Assignment**## Getting Started



A comprehensive employee and task management system built with Next.js, MongoDB, and Clerk authentication.First, run the development server:



## Features```bash

npm run dev

### Admin Dashboard# or

- ✅ Create, read, update, and delete employeesyarn dev

- ✅ Assign tasks to employees# or

- ✅ Track task progress and statuspnpm dev

- ✅ Monitor overall performance metrics# or

- ✅ Set task priorities (Low, Medium, High, Urgent)bun dev

- ✅ Set due dates for tasks```



### Employee PortalOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- ✅ View all assigned tasks

- ✅ Update task status (To Do, In Progress, Completed, Blocked)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- ✅ Log time spent on tasks

- ✅ Track due dates and overdue tasksThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- ✅ View task priorities

## Learn More

## Tech Stack

To learn more about Next.js, take a look at the following resources:

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS

- **Backend**: Next.js API Routes- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **Database**: MongoDB (with Mongoose ODM)- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Authentication**: Clerk (with role-based access control)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Setup Instructions

## Deploy on Vercel

### 1. Install Dependencies

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```bash

npm installCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

### 2. Setup MongoDB (Free Cluster)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account or sign in
3. Click "Build a Database" → Choose **FREE** tier (M0)
4. Select a cloud provider and region (any)
5. Create cluster (takes 1-3 minutes)
6. Click "Connect" → "Drivers"
7. Copy the connection string
8. Replace `<password>` with your database password
9. Save this connection string for the next step

### 3. Setup Clerk Authentication (Free)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a free account or sign in
3. Click "+ Create Application"
4. Name it "Employee Task Management"
5. Select Email and Password as authentication method
6. Click "Create Application"
7. Copy your keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

**IMPORTANT: Set Admin Role Manually**
- After first user signs up, go to Clerk Dashboard
- Users → Click on your user → Metadata
- Add to **Public Metadata**:
  ```json
  {
    "role": "admin"
  }
  ```
- Save changes

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your actual values in `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
   CLERK_SECRET_KEY=sk_test_your_actual_key
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-task-db?retryWrites=true&w=majority
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### For Admin

1. **Sign up** as the first user
2. **Set admin role** in Clerk Dashboard (see step 3 above)
3. **Sign in again** (refresh to load new role)
4. You'll be redirected to `/admin/dashboard`
5. **Create employees** from the "Employees" tab
6. **Assign tasks** from the "Tasks" tab

### For Employee

1. Admin creates your account with credentials
2. **Sign in** with provided email and password
3. You'll be redirected to `/employee/dashboard`
4. **View tasks** assigned to you
5. **Update status** and **log time** on tasks

## Project Structure

```
├── app/
│   ├── admin/dashboard/          # Admin dashboard UI
│   ├── employee/dashboard/       # Employee dashboard UI
│   ├── api/
│   │   ├── employees/           # Employee CRUD endpoints
│   │   ├── tasks/               # Task CRUD endpoints
│   │   └── sync-user/           # User sync helper
│   ├── sign-in/                 # Sign in page
│   ├── sign-up/                 # Sign up page
│   └── page.tsx                 # Landing page
├── models/
│   ├── Employee.ts              # Employee MongoDB schema
│   └── Task.ts                  # Task MongoDB schema
├── lib/
│   └── mongodb.ts               # Database connection
├── middleware.ts                # Role-based route protection
└── .env.local                   # Environment variables
```

## API Endpoints

### Employees (Admin Only)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get single employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Tasks
- `GET /api/tasks` - Get tasks (filtered by role)
- `POST /api/tasks` - Create new task (Admin only)
- `GET /api/tasks/[id]` - Get single task
- `PUT /api/tasks/[id]` - Update task (Admin: all fields, Employee: status & time only)
- `DELETE /api/tasks/[id]` - Delete task (Admin only)

## Database Models

### Employee
```typescript
{
  clerkUserId: string
  email: string
  name: string
  role: 'admin' | 'employee'
  department?: string
  position?: string
  hireDate: Date
}
```

### Task
```typescript
{
  title: string
  description: string
  assignedTo: ObjectId (Employee)
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate: Date
  timeLogged?: number (in minutes)
  createdBy: string (Clerk User ID)
}
```

## Features Implemented

✅ **Employee CRUD** - Full create, read, update, delete operations  
✅ **Task Assignment** - Admin can assign tasks with priorities  
✅ **Task Status Tracking** - 4 status levels (To Do, In Progress, Completed, Blocked)  
✅ **Priority Levels** - 4 priority levels (Low, Medium, High, Urgent)  
✅ **Time Logging** - Employees can log time spent on tasks  
✅ **Role-Based Access Control** - Separate admin and employee views  
✅ **Authentication** - Secure login with Clerk  
✅ **Database Integration** - MongoDB for data persistence  
✅ **RESTful API** - Clean API architecture  
✅ **Responsive UI** - Works on desktop and mobile  

## Notes

- First user needs manual admin role assignment in Clerk Dashboard
- Employees are created by admin through the dashboard
- Employee accounts are automatically created in Clerk when added
- Deleting an employee also deletes all their assigned tasks
- Only employees can see their own tasks
- Admin can see and manage all tasks
- Simple design without external icon/date libraries (assignment-friendly)
