import { Link, useRouteError } from 'react-router-dom';

export default function PageError() {
  const error: any = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-neutral gap-4">
      <h1 className="text-4xl font-bold text-neutral-content">
        {error.statusText}
      </h1>
      <p className="text-lg text-neutral-content">{error.message}</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
