# Setup Checklist - Employee Task Management System

Follow these steps in order to get your project running:

## ✅ Step 1: MongoDB Atlas Setup (FREE)

1. [ ] Go to https://cloud.mongodb.com/
2. [ ] Create account or sign in
3. [ ] Click "Build a Database"
4. [ ] Select **FREE (M0)** tier
5. [ ] Choose cloud provider & region
6. [ ] Create cluster (wait 1-3 mins)
7. [ ] Click "Connect" button
8. [ ] Select "Drivers"
9. [ ] Copy connection string
10. [ ] Save it - you'll need it for `.env.local`

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/employee-task-db?retryWrites=true&w=majority
```

---

## ✅ Step 2: Clerk Authentication Setup (FREE)

1. [ ] Go to https://dashboard.clerk.com/
2. [ ] Create account or sign in
3. [ ] Click "+ Create Application"
4. [ ] Name: "Employee Task Management"
5. [ ] Enable: ✅ Email & Password
6. [ ] Click "Create Application"
7. [ ] Copy **Publishable Key** (starts with `pk_test_`)
8. [ ] Copy **Secret Key** (starts with `sk_test_`)
9. [ ] Save both keys - you'll need them for `.env.local`

---

## ✅ Step 3: Configure Environment Variables

1. [ ] Open `.env.local.example` file
2. [ ] Copy it and rename to `.env.local`
3. [ ] Fill in your actual values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_PASTE_YOUR_KEY_HERE
MONGODB_URI=mongodb+srv://PASTE_YOUR_CONNECTION_STRING_HERE
```

4. [ ] Save the file

---

## ✅ Step 4: Run the Application

1. [ ] Open terminal in project folder
2. [ ] Run: `npm install` (if not done already)
3. [ ] Run: `npm run dev`
4. [ ] Open browser to: http://localhost:3000

---

## ✅ Step 5: Create Admin Account

1. [ ] Click "Sign Up" on the homepage
2. [ ] Create your first account (any email/password)
3. [ ] **IMPORTANT:** Go to Clerk Dashboard
4. [ ] Navigate to: Users → Click your user → Metadata tab
5. [ ] Under "Public Metadata", click "Edit"
6. [ ] Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
7. [ ] Click "Save"
8. [ ] Go back to your app and **refresh the page**
9. [ ] Sign in again - you should now see Admin Dashboard

---

## ✅ Step 6: Test the Features

### As Admin:
1. [ ] Navigate to "Employees" tab
2. [ ] Click "+ Add Employee"
3. [ ] Create a test employee account
4. [ ] Navigate to "Tasks" tab
5. [ ] Click "+ Create Task"
6. [ ] Assign task to the employee you created
7. [ ] Verify task appears in the list

### As Employee:
1. [ ] Sign out from admin account
2. [ ] Sign in with employee credentials you created
3. [ ] View your assigned tasks
4. [ ] Click "Update" on a task
5. [ ] Change status to "In Progress"
6. [ ] Add time logged (e.g., 30 minutes)
7. [ ] Save changes
8. [ ] Verify the updates appear

---

## 🎉 You're All Set!

Your Employee Task Management System is now ready.

## Common Issues & Solutions

### ❌ "Unauthorized" error
- Check if your Clerk keys are correct in `.env.local`
- Make sure keys don't have extra spaces

### ❌ "Failed to connect to MongoDB"
- Verify your MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas (Network Access)
- Make sure password doesn't contain special characters (or URL-encode them)

### ❌ Can't see Admin Dashboard after setting role
- Clear browser cache and cookies
- Sign out completely and sign in again
- Double-check the metadata JSON format in Clerk

### ❌ Port 3000 already in use
- Run: `npx kill-port 3000` (Windows: `taskkill /F /IM node.exe`)
- Or use different port: `npm run dev -- -p 3001`

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- `.env.local.example` - Example environment variables
- `app/api/` - API endpoint implementations

Good luck with your assignment! 🚀
