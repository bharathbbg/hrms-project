import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";
import EditEmployeeForm from "@/components/EditEmployeeForm"; // We will create this next
import { redirect } from "next/navigation";

// The "params" prop is automatically injected by Next.js for dynamic routes
export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  
  // Fetch the data on the server side (No API call needed! Direct DB access)
  const employee = await Employee.findById(id).lean();

  if (!employee) {
    redirect("/"); // If ID is bad, send them home
  }

  // We convert the Mongo ID object to a string for the client component
  // Using generic "any" to bypass strict typing for speed in this tutorial
  const plainEmployee = {
    ...employee,
    _id: employee._id.toString(),
    // Convert dates to string to pass to Client Components safely
    joinedAt: employee.joinedAt?.toISOString(), 
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
           Edit details for: <span className="text-blue-600">{plainEmployee.firstName}</span>
        </h1>
        
        {/* Pass the existing data into the form */}
        <EditEmployeeForm employee={plainEmployee} />
      </div>
    </div>
  );
}