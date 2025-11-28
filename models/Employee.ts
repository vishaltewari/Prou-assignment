import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEmployee extends Document {
  clerkUserId: string
  email: string
  name: string
  role: 'admin' | 'employee'
  department?: string
  position?: string
  hireDate: Date
  createdAt: Date
  updatedAt: Date
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
    },
    department: {
      type: String,
    },
    position: {
      type: String,
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema)

export default Employee
