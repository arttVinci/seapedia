import { Outlet } from 'react-router-dom';

export function PrivateLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
