import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // The singleton we made earlier

export async function GET() {
  try {
    // 1. Connect to the DB
    await dbConnect();

    // 2. Return a JSON response
    return NextResponse.json(
      { message: 'Database Connection Successful', status: 'OK' }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Database Connection Failed', error: (error as Error).message }, 
      { status: 500 }
    );
  }
}