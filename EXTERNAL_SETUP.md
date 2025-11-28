# 🎯 What You Need to Do Externally

Before running the project, you need to set up these **FREE** external services:

---

## 1️⃣ MongoDB Atlas (FREE Cluster)

**Why?** Database to store employees and tasks

### Steps:
1. Go to: **https://cloud.mongodb.com/**
2. Create free account (or sign in)
3. Click **"Build a Database"**
4. Choose **FREE (M0 Sandbox)** tier - 512 MB storage
5. Select any Cloud Provider & Region
6. Click **"Create"** (takes 1-3 minutes)
7. After creation, click **"Connect"**
8. Choose **"Drivers"**
9. **Copy the connection string** - looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. **Important:** Replace `<password>` with your actual database password

**You'll need:** The complete connection string for `.env.local`

---

## 2️⃣ Clerk Authentication (FREE)

**Why?** User authentication and role management

### Steps:
1. Go to: **https://dashboard.clerk.com/**
2. Create free account (or sign in)
3. Click **"+ Create Application"**
4. Name it: **"Employee Task Management"**
5. Select authentication: ✅ **Email** and ✅ **Password**
6. Click **"Create Application"**
7. You'll see your API Keys page
8. **Copy these two keys:**
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

**You'll need:** Both keys for `.env.local`

---

## 3️⃣ Configure .env.local File

1. **Copy** the `.env.local.example` file
2. **Rename** it to `.env.local`
3. **Fill in** your actual values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-task-db?retryWrites=true&w=majority
```

**Don't commit `.env.local` to git!** (It's already in `.gitignore`)

---

## 4️⃣ Set First User as Admin (MANUAL STEP)

**After you sign up for the first time:**

1. Go to **Clerk Dashboard**: https://dashboard.clerk.com/
2. Navigate to: **Users** → Click on your user
3. Click **"Metadata"** tab
4. Under **"Public Metadata"**, click **"Edit"**
5. Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click **"Save"**
7. **Go back to your app and refresh the page**
8. Sign in again - you should now have admin access

---

## 5️⃣ Run the Project

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Open: **http://localhost:3000**

---

## 📋 Quick Summary

| Service | What to Get | Where |
|---------|------------|-------|
| **MongoDB Atlas** | Connection String | https://cloud.mongodb.com/ |
| **Clerk** | Publishable Key + Secret Key | https://dashboard.clerk.com/ |
| **Admin Role** | Set in Clerk Dashboard | Users → Metadata |

---

## ✅ That's It!

Once you:
1. ✅ Create MongoDB cluster and get connection string
2. ✅ Create Clerk app and get both keys
3. ✅ Fill `.env.local` with these values
4. ✅ Run `npm run dev`
5. ✅ Sign up and set admin role in Clerk Dashboard

Your app will be fully functional! 🚀

---

## 💡 Tips

- Both MongoDB and Clerk have **FREE** tiers - no credit card required
- Setup takes about **10-15 minutes** total
- Keep your keys safe and never commit `.env.local` to GitHub
- If you get "Unauthorized" errors, double-check your Clerk keys
- If you can't connect to MongoDB, verify the connection string

Need detailed steps? Check **SETUP_CHECKLIST.md**
