import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the Interface (for TypeScript type safety - like a Java POJO)
export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  joinedAt: Date;
  password?: string; // Optional because we might add them before they have a login
  role: 'admin' | 'employee' | 'hr';
}

// 2. Define the Schema (Database constraints)
const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  joinedAt: { type: Date, default: Date.now },
  password: { type: String, select: false }, // 'select: false' ensures we don't return passwords in query results by default!
  role: { type: String, enum: ['admin', 'employee', 'hr'], default: 'employee' },
});

export default mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);