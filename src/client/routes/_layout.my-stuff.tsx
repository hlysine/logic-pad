import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { memo } from 'react';
import { FaFolder, FaPlus } from 'react-icons/fa';
import ResponsiveLayout from '../components/ResponsiveLayout';

export const Route = createFileRoute('/_layout/my-stuff')({
  component: memo(function MyStuff() {
    return (
      <ResponsiveLayout>
        <div className="flex mt-8 items-center justify-between">
          <div className="text-3xl">
            <FaFolder className="inline-block me-4" />
            My stuff
          </div>
          <div className="flex items-center gap-4">
            <Link to="/create" className="btn">
              <FaPlus />
              New puzzle
            </Link>
            <button className="btn">
              <FaPlus />
              New collection
            </button>
          </div>
        </div>
        <Outlet />
      </ResponsiveLayout>
    );
  }),
});
