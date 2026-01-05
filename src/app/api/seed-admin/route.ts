import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Check if admin already exists
    const existingAdmin = await Employee.findOne({ email: "admin@company.com" });
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin already exists. You can proceed to login." 
      }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 3. Create Admin
    const admin = await Employee.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@company.com",
      department: "IT",
      role: "admin",
      password: hashedPassword,
      isActive: true,
      joinedAt: new Date()
    });

    return NextResponse.json({ success: true, message: "Admin created successfully", id: admin._id });

  } catch (error: any) {
    console.error("Seed Error:", error); // Log to terminal
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}