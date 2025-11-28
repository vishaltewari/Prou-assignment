import mongoose, { Schema, Document, Model } from 'mongoose'

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'Blocked'
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface ITask extends Document {
  title: string
  description: string
  assignedTo: mongoose.Types.ObjectId // Employee ID
  assignedToEmail: string // For easy lookup
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date
  timeLogged?: number // in minutes
  createdBy: string // Clerk User ID of admin
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    assignedToEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed', 'Blocked'],
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    timeLogged: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)

export default Task
