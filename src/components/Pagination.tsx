"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  // Get current page from URL, default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    replace(createPageURL(page));
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        className={`px-4 py-2 border rounded ${
          currentPage <= 1 
            ? "text-gray-300 border-gray-200 cursor-not-allowed" 
            : "text-blue-600 border-blue-600 hover:bg-blue-50"
        }`}
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>

      <span className="flex items-center text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`px-4 py-2 border rounded ${
          currentPage >= totalPages 
            ? "text-gray-300 border-gray-200 cursor-not-allowed" 
            : "text-blue-600 border-blue-600 hover:bg-blue-50"
        }`}
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}