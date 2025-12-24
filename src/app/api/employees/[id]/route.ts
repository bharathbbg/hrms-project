import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';

// GET: Fetch single employee (e.g., fetch "BG" details to pre-fill the form)
// Route: GET /api/employees/123
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params; // Access the dynamic ID from the URL path

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// PUT: Update employee details
// Route: PUT /api/employees/123
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;
  const body = await request.json();

  try {
    const employee = await Employee.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document, not the old one
      runValidators: true, // Enforce Schema rules (e.g. required fields)
    });
    
    if (!employee) {
       return NextResponse.json({ success: false }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}