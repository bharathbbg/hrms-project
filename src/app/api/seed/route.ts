import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';

// Generic Kannada names
const firstNames = [
  "Manjunath", "Basavaraj", "Gowri", "Savitha", "Chethan", 
  "Ramesh", "Suresh", "Lakshmi", "Ganesh", "Geetha", 
  "Deepa", "Santosh", "Veena", "Anil", "Sunita", 
  "Praveen", "Kavitha", "Nagaraj", "Shwetha", "Krishna"
];

const lastNames = [
  "Patil", "Hegde", "Kulkarni", "Rao", "Bhat", 
  "Desai", "Joshi", "Naik", "Shenoy", "Shetty", 
  "Gowda", "Acharya", "Kamat", "Pai", "Reddy"
];

const departments = ["Engineering", "HR", "Operations", "Finance", "Sales"];

export async function GET() {
  await dbConnect();

  try {
    // Optional: Clear existing data to start fresh
    // await Employee.deleteMany({}); 

    const employees = [];

    // 1. Generate 100 Random Employees
    for (let i = 0; i < 100; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      const dept = departments[Math.floor(Math.random() * departments.length)];
      
      employees.push({
        firstName: first,
        lastName: last,
        email: `${first.toLowerCase()}.${last.toLowerCase()}.${i}@example.com`, // Unique email
        department: dept,
        isActive: Math.random() > 0.2, // 80% chance of being active
        joinedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random past date
      });
    }

    // 2. Insert Explicit "Corner Case" Data for Testing Search
    // (Names that look similar to test partial matching)
    employees.push(
      { firstName: "Manjunath", lastName: "Hegde", email: "manju.hegde.test@example.com", department: "Engineering", isActive: true },
      { firstName: "Manjunatha", lastName: "Bhat", email: "manjunatha.bhat.test@example.com", department: "HR", isActive: true }, // "Manju" match
      { firstName: "Manju", lastName: "Prasad", email: "manju.prasad.test@example.com", department: "Operations", isActive: true }, // Exact substring match
      { firstName: "Ramanjunath", lastName: "Rao", email: "ramanjunath.rao.test@example.com", department: "Finance", isActive: true }, // Contains "Manjunath"
      
      { firstName: "Gowri", lastName: "Shankar", email: "gowri.shankar.test@example.com", department: "Engineering", isActive: true },
      { firstName: "Gowrish", lastName: "Kaikini", email: "gowrish.k.test@example.com", department: "Engineering", isActive: true }
    );

    // Bulk Insert
    await Employee.insertMany(employees);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully added ${employees.length} employees.` 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}