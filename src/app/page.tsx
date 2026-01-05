import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";
import EmployeeCard from "@/components/EmployeeCard";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import Search from "@/components/Search"; 
import { auth, signOut } from "@/auth";
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
  const session = await auth(); // Get the user
  const userRole = session?.user?.role; // Access the role

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
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
            {session?.user && (
              <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-blue-600">{session.user.name}</span>
              </p>
            )}
          </div>

          {/* Sign Out Button */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 border border-red-200 rounded hover:bg-red-50 transition">
              Sign Out
            </button>
          </form>
        </div>
        
        <div className="flex justify-between items-center mb-6">
           <div className="w-full md:w-1/2">
             <Search />
           </div>
        </div>

        {session?.user?.role === 'admin' && (
          <AddEmployeeForm />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 min-h-[50vh]">
          {employees.map((employee: any) => (
            <EmployeeCard 
              key={employee._id}
              id={employee._id.toString()}
              firstName={employee.firstName}
              lastName={employee.lastName}
              department={employee.department}
              isActive={employee.isActive}
              isAdmin={session?.user?.role === 'admin'}
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