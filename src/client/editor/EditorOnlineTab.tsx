import { memo } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { useQuery } from '@tanstack/react-query';
import { puzzleQueryOptions } from '../routes/_context._layout.edit.$puzzleId';
import { ResourceStatus } from '../online/data';
import { FaCheckSquare, FaHeart } from 'react-icons/fa';
import Loading from '../components/Loading';

export default memo(function EditorOnlineTab() {
  const { id } = useOnlinePuzzle();
  const { data, isLoading } = useQuery(puzzleQueryOptions(id));

  if (isLoading) {
    return <Loading />;
  }

  if (id.length === 0 || !data) {
    return (
      <div className="flex flex-col gap-4 p-8 bg-base-100 text-base-content rounded-2xl shadow-lg w-full max-w-[800px]">
        <p className="text-2xl font-bold">Editing offline</p>
        <p>
          Upload your puzzle to access it anywhere. Your puzzle will be kept as
          a private draft until you publish it.
        </p>
        <button className="btn btn-primary">Upload</button>
      </div>
    );
  }

  if (data.status === ResourceStatus.Private) {
    return (
      <div className="flex flex-col gap-4 p-8 bg-base-100 text-base-content rounded-2xl shadow-lg w-full max-w-[800px]">
        <p className="text-2xl font-bold">Online information</p>
        <div className="flex gap-2 items-center">
          <div className="badge badge-lg badge-neutral p-4">Private</div>
        </div>
        <div>Created at {new Date(data.createdAt).toLocaleString()}</div>
        <div className="divider" />
        <p className="text-2xl font-bold">Publish puzzle</p>
        <p>
          Publish this puzzle for public access when it is ready to be solved.
        </p>
        <ul className="list-disc list-inside">
          <li>Completion statistics will be available after publish.</li>
          <li>
            You can update the puzzle after publishing, but statistics will not
            be reset.
          </li>
          <li>You cannot unpublish a puzzle.</li>
          <li>Do not publish unfinished puzzles.</li>
        </ul>
        <button className="btn btn-primary">Publish puzzle</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-8 bg-base-100 text-base-content rounded-2xl shadow-lg w-full max-w-[800px]">
      <p className="text-2xl font-bold">Online information</p>
      <div className="flex gap-4 items-center">
        <div className="badge badge-lg badge-info p-4">Public</div>
        <span className="badge badge-lg p-4 badge-neutral">
          <FaCheckSquare className="inline-block me-2" /> {data.solveCount}{' '}
          solves
        </span>
        <span className="badge badge-lg p-4 badge-neutral">
          <FaHeart className="inline-block me-2" /> {data.loveCount} loves
        </span>
      </div>
      <div>
        Created at {new Date(data.createdAt).toLocaleString()}
        <br />
        {data.publishedAt
          ? `Published at ${new Date(data.publishedAt).toLocaleString()}`
          : ''}
      </div>
      <p className="opacity-50">TODO: add rating statistics</p>
      <div className="divider" />
      <p className="text-2xl font-bold">Feedback</p>
      <p className="opacity-50">TODO: add feedback</p>
    </div>
  );
});
