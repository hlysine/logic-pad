import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center self-stretch flex-1 bg-neutral gap-4">
      <h1 className="text-4xl">Not found</h1>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
