import { useOnline } from '../contexts/OnlineContext.tsx';
import { PiSignInBold } from 'react-icons/pi';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext.tsx';
import { memo, useEffect, useMemo, useRef } from 'react';
import deferredRedirect from '../router/deferredRedirect.ts';
import { useRouterState } from '@tanstack/react-router';
import { useGridState } from '../contexts/GridStateContext.tsx';
import { State } from '@logic-pad/core/index.ts';
import onlineSolveTracker from '../router/onlineSolveTracker.ts';
import { useQuery } from '@tanstack/react-query';
import { api } from '../online/api.ts';
import Loading from './Loading.tsx';

const SolveTrackerAnonymous = memo(function SolveTracker() {
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();
  const routerState = useRouterState();
  const { state } = useGridState();

  useEffect(() => {
    if (!isOnline || !!me || !id) return;
    if (State.isSatisfied(state.final)) {
      void onlineSolveTracker.completeSolve(id);
    }
  }, [isOnline, me, id, state.final]);

  const solved = useMemo(() => onlineSolveTracker.isSolved(id), [id]);

  if (!isOnline || !!me || !id) return null;

  return (
    <div className="flex p-2 ps-4 leading-8 rounded-2xl shadow-md bg-base-100 text-base-content items-center justify-between">
      {solved || State.isSatisfied(state.final)
        ? 'Puzzle solved!'
        : 'Sign in to track solves'}
      <div className="flex items-center gap-2">
        <div className="tooltip tooltip-top tooltip-info" data-tip="Sign in">
          <button
            className="btn btn-sm btn-ghost"
            onClick={async () => {
              await deferredRedirect.setAndNavigate(routerState.location, {
                to: '/auth',
              });
            }}
          >
            <PiSignInBold size={22} />
          </button>
        </div>
      </div>
    </div>
  );
});

const SolveTrackerSignedIn = memo(function SolveTracker() {
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();
  const completionBegin = useQuery({
    queryKey: ['completion', 'begin', id],
    queryFn: () => api.completionBegin(id),
    enabled: isOnline && !!me && !!id,
  });

  const msElapsedTime = useRef<number>(0);
  const activeStartTick = useRef<number>(Date.now());

  useEffect(() => {
    const eventHandler = () => {
      console.log('Event triggered');
      if (document.visibilityState === 'hidden') {
        msElapsedTime.current += Date.now() - activeStartTick.current;
        onlineSolveTracker.sendSolving(id, msElapsedTime.current);
        msElapsedTime.current = 0;
      } else {
        activeStartTick.current = Date.now();
      }
    };
    console.log('Adding event listener');
    document.addEventListener('visibilitychange', eventHandler, false);
    return () => {
      console.log('Removing event listener');
      document.removeEventListener('visibilitychange', eventHandler);
    };
  }, [id, isOnline, me]);

  const { state } = useGridState();

  useEffect(() => {
    if (!isOnline || !me || !id) return;
    if (State.isSatisfied(state.final)) {
      msElapsedTime.current += Date.now() - activeStartTick.current;
      void onlineSolveTracker.completeSolve(id, msElapsedTime.current);
      msElapsedTime.current = 0;
    }
  }, [isOnline, me, id, state.final]);

  if (!isOnline || !me || !id) return null;

  if (completionBegin.isPending) {
    return (
      <div className="flex p-2 ps-4 leading-8 rounded-2xl shadow-md bg-base-100 text-base-content items-center justify-between">
        <Loading />
      </div>
    );
  }

  if (!completionBegin.data!.solvedAt) {
    return (
      <div className="flex p-2 ps-4 leading-8 rounded-2xl shadow-md bg-base-100 text-base-content items-center justify-between">
        New puzzle
      </div>
    );
  }
});

export default memo(function PuzzleSolveControl() {
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();

  if (!isOnline) {
    return (
      <div className="flex p-2 ps-4 leading-8 rounded-2xl shadow-md bg-base-100 text-base-content items-center justify-between">
        Solving offline
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex p-2 ps-4 leading-8 rounded-2xl shadow-md bg-base-100 text-base-content items-center justify-between">
        Solving locally
      </div>
    );
  } else if (me) {
    return <SolveTrackerSignedIn />;
  } else {
    return <SolveTrackerAnonymous />;
  }
});
