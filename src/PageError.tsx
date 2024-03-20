import { Link, useRouteError } from 'react-router-dom';

function validateError(
  error: unknown
): error is { statusText?: string; message?: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    ('statusText' in error || 'message' in error)
  );
}

export default function PageError() {
  const rawError = useRouteError();
  const error = validateError(rawError)
    ? rawError
    : {
        statusText: 'Unknown error',
        message: JSON.stringify(rawError, undefined, 2),
      };
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
