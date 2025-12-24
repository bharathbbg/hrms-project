import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";
import EmployeeCard from "@/components/EmployeeCard";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import Search from "@/components/Search"; // Import the new component

// Interface for the URL parameters
interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Home(props: PageProps) {
  // Await the search params (Next.js 15 requirement, good practice in 14 too)
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";

  await dbConnect();

  // Build the filter object
  // If query exists, search firstName OR lastName (case-insensitive regex)
  const filter = query
    ? {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  const employees = await Employee.find(filter).sort({ joinedAt: -1 }).lean();

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Employee Directory
        </h1>
        
        {/* Layout: Search Bar on top */}
        <div className="flex justify-between items-center mb-6">
           <div className="w-full md:w-1/2">
             <Search />
           </div>
        </div>

        <AddEmployeeForm />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 min-h-[50vh]">
          {employees.map((employee: any) => (
            <EmployeeCard 
              key={employee._id}
              id={employee._id.toString()}
              firstName={employee.firstName}
              lastName={employee.lastName}
              department={employee.department}
              isActive={employee.isActive}
            />
          ))}
        </div>
        
        {employees.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No employees found matching "{query}".
          </p>
        )}
      </div>
    </main>
  );
}