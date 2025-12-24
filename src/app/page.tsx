import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";
import EmployeeCard from "@/components/EmployeeCard";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import Search from "@/components/Search"; 
import Pagination from "@/components/Pagination"; // Import the new component

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const ITEMS_PER_PAGE = 6;

  await dbConnect();

  // 1. Build Filter
  const filter = query
    ? {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  // 2. Calculate Skip
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // 3. Parallel Execution (Optimization)
  // We run both the count query and the data query at the same time
  const [totalItems, employees] = await Promise.all([
    Employee.countDocuments(filter),
    Employee.find(filter)
      .sort({ joinedAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Employee Directory
        </h1>
        
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
        
        {employees.length === 0 ? (
           <p className="text-gray-500 text-center mt-10">
             No employees found matching "{query}".
           </p>
        ) : (
           /* 4. Add the Pagination Controls at the bottom */
           <Pagination totalPages={totalPages} />
        )}
      </div>
    </main>
  );
}