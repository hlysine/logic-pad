import { memo } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { puzzleQueryOptions } from '../routes/_context._layout.edit.$puzzleId';
import { ResourceStatus } from '../online/data';
import { FaCheckSquare, FaHeart } from 'react-icons/fa';
import Loading from '../components/Loading';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { useGrid } from '../contexts/GridContext';
import deferredRedirect from '../router/deferredRedirect';
import { SolutionHandling } from '../router/linkLoader';
import { useOnline } from '../contexts/OnlineContext';
import RatedDifficulty from '../components/RatedDifficulty';
import { api, queryClient } from '../online/api';
import { useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';

const SignInWithProgress = memo(function SignInWithProgress() {
  const { metadata, grid, solution } = useGrid();
  return (
    <button
      className="btn btn-primary"
      onClick={async () => {
        const data = await Compressor.compress(
          Serializer.stringifyPuzzle({ ...metadata, grid, solution })
        );
        await deferredRedirect.setAndNavigate(
          {
            to: '/create',
            search: {
              loader: SolutionHandling.LoadVisible,
              d: data,
            },
            ignoreBlocker: true,
          },
          { to: '/auth', ignoreBlocker: true }
        );
      }}
    >
      Sign in / sign up
    </button>
  );
});

const UploadPuzzle = memo(function UploadPuzzle() {
  const uploadPuzzle = useMutation({
    mutationFn: (data: Parameters<typeof api.createPuzzle>) => {
      return api.createPuzzle(...data);
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { metadata, grid } = useGrid();
  const navigate = useNavigate();

  if (uploadPuzzle.isPending) {
    return (
      <button className="btn btn-primary btn-disabled">
        <Loading />
      </button>
    );
  }

  if (uploadPuzzle.isSuccess) {
    return (
      <button className="btn btn-primary btn-disabled">Redirecting...</button>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={async () => {
        const data = await Compressor.compress(Serializer.stringifyGrid(grid));
        const puzzle = await uploadPuzzle.mutateAsync([
          metadata.title,
          metadata.description,
          metadata.difficulty,
          data,
        ]);
        await navigate({
          to: `/edit/${puzzle.id}`,
          ignoreBlocker: true,
        });
      }}
    >
      Upload puzzle
    </button>
  );
});

const PublishPuzzle = memo(function PublishPuzzle() {
  const { id } = useOnlinePuzzle();
  const publishPuzzle = useMutation({
    mutationFn: (puzzleId: string) => {
      return api.publishPuzzle(puzzleId);
    },
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      await queryClient.refetchQueries({
        queryKey: ['puzzle', id],
      });
    },
  });

  if (publishPuzzle.isPending) {
    return (
      <button className="btn btn-primary btn-disabled">
        <Loading />
      </button>
    );
  }

  if (publishPuzzle.isSuccess) {
    return (
      <button className="btn btn-primary btn-disabled">Refreshing...</button>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={async () => await publishPuzzle.mutateAsync(id)}
    >
      Publish puzzle
    </button>
  );
});

export default memo(function EditorOnlineTab() {
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();
  const { data, isLoading } = useQuery(puzzleQueryOptions(id));

  if (isLoading) {
    return <Loading />;
  }

  if (id.length === 0 || !data) {
    return (
      <div className="flex flex-col gap-4 p-8 bg-base-100 text-base-content rounded-2xl shadow-lg w-full max-w-[800px]">
        <p className="text-2xl font-bold">Editing locally</p>
        {!isOnline ? (
          <p>Go online to upload your puzzle and access it from anywhere.</p>
        ) : !me ? (
          <>
            <p>
              Sign in to upload your puzzle and access it from anywhere. Your
              will keep your current progress by signing in with the button
              below.
            </p>
            <SignInWithProgress />
          </>
        ) : (
          <>
            <p>
              Upload your puzzle to access it from anywhere. Your puzzle will be
              kept as a private draft until you publish it.
            </p>
            <p>Only upload puzzles that you created yourself.</p>
            <UploadPuzzle />
          </>
        )}
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
        <PublishPuzzle />
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
      <RatedDifficulty
        collapsible={false}
        ratedDifficulty={data.ratedDifficulty}
      />
      <div className="divider" />
      <p className="text-2xl font-bold">Feedback</p>
      <p className="opacity-50">TODO: add feedback</p>
    </div>
  );
});
