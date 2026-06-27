import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Seapedia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-700">
              Terms
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
