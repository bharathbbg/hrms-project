import dbConnect from "@/lib/db";
import Employee, { IEmployee } from "@/models/Employee";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import EmployeeCard from "@/components/EmployeeCard"; // Import the new component

// This is a Server Component (async allows await inside)
export default async function Home() {
  await dbConnect();
  const employees = await Employee.find({}).sort({ joinedAt: -1 }).lean();

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Directory</h1>
        
        <AddEmployeeForm />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((employee: any) => (
            // PASSING PROPS: Injecting data into the component
            <EmployeeCard 
              key={employee._id}
              id={employee._id.toString()} // Mongo ID is an object, convert to string
              firstName={employee.firstName}
              lastName={employee.lastName}
              department={employee.department}
              isActive={employee.isActive}
            />
          ))}
        </div>
        
        {employees.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No employees found.</p>
        )}
      </div>
    </main>
  );
}