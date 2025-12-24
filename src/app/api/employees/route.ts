import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';

// @GetMapping("/api/employees")
export async function GET() {
  await dbConnect();
  try {
    const employees = await Employee.find({});
    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// @PostMapping("/api/employees")
export async function POST(request: Request) {
  await dbConnect();
  try {
    // In Spring: public Employee create(@RequestBody Employee employee)
    // In Next.js: We manually parse the JSON body
    const body = await request.json();

    const employee = await Employee.create(body);
    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// @DeleteMapping("/api/employees")
export async function DELETE(request: Request) {
  await dbConnect();
  
  // Extract query parameters: URL?id=123
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
  }

  try {
    await Employee.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}