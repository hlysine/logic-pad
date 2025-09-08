import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense, lazy, memo, useEffect } from 'react';
import QuickAccessBar from '../components/QuickAccessBar';
import Changelog from '../components/Changelog';
import Loading from '../components/Loading';
import GridData from '@logic-pad/core/data/grid';
import GridConnections from '@logic-pad/core/data/gridConnections';
import useLinkLoader from '../router/linkLoader';
import PWAPrompt from '../components/PWAPrompt';
import toast from 'react-hot-toast';
import deferredRedirect from '../router/deferredRedirect';
import AlphaBadge from '../components/AlphaBadge';
import FrontPageLists from '../online/FrontPageLists';
import PersonalFrontPageLists from '../online/PersonalFrontPageLists';
import { useOnline } from '../contexts/OnlineContext';
import Footer from '../components/Footer';
import { router } from '../main';

const FrontPageGrid = lazy(async () => {
  const Grid = (await import('../grid/Grid')).default;

  const grid = GridData.create([
    '.nwww',
    'nnwbb',
    'nnwbw',
    'nnBwW',
    '.nnn.',
  ]).withConnections(
    GridConnections.create(['..aaa', '..abb', '..ab.', '.....', '.....'])
  );

  return {
    default: memo(function FrontPageGrid() {
      return (
        <Grid
          type="canvas"
          size={100}
          grid={grid}
          editable={false}
          className="absolute left-1/2 xl:right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink -rotate-[5deg] opacity-75 fade-in-fast"
        />
      );
    }),
  };
});

export const Route = createFileRoute('/')({
  component: memo(function Home() {
    const navigate = useNavigate();
    const { isOnline, me } = useOnline();
    useLinkLoader({ cleanUrl: true, allowEmpty: true });
    useEffect(() => {
      let toastId: string | undefined;
      void (async () => {
        // this is likely due to OAuth errors
        if ('error' in router.state.location.search) {
          // display a toast and clear the search params
          toastId = toast.error('An error occurred. Please try again.');
          if (!(await deferredRedirect.execute())) {
            void navigate({
              to: '/',
              search: {},
              ignoreBlocker: true,
            });
          }
        }
      })();
      return () => {
        if (toastId) {
          toast.dismiss(toastId);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <>
        <div className="flex flex-col gap-4 items-stretch min-h-svh shrink-0">
          <div className="flex flex-col shrink-0">
            <PWAPrompt />
            <QuickAccessBar className="justify-end px-8 py-2" />
            <div className="flex flex-col xl:flex-row grow gap-32 items-center justify-center p-16 z-10">
              <div className="relative order-1 grow shrink self-stretch overflow-visible pointer-events-none -z-10 min-h-64 m-16">
                <div className="absolute w-0 h-0 top-1/2 left-1/2 logo-glow fade-in-fast"></div>
                <Suspense fallback={null}>
                  <FrontPageGrid />
                </Suspense>
              </div>
              <div className="flex flex-wrap shrink-0 grow-0 justify-center gap-8">
                <div className="relative w-32 h-32 inline-block">
                  <div className="absolute w-0 h-0 top-1/2 left-1/2 logo-glow fade-in-slow"></div>
                  <img
                    src="/logo.svg"
                    className="absolute inset-0"
                    alt="Logic Pad logo"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-accent text-4xl lg:text-6xl font-medium font-serif">
                    Logic Pad
                    <AlphaBadge className="ms-4" />
                  </h1>
                  <span className="text-xl lg:text-2xl">
                    A modern, open-source web app for grid-based puzzles.
                  </span>
                  <div className="flex flex-wrap gap-4 items-center mt-4">
                    <Link
                      type="button"
                      to="/create"
                      className="btn btn-md lg:btn-lg btn-accent"
                    >
                      Create new puzzle
                    </Link>
                    {isOnline ? (
                      <>
                        <Link
                          type="button"
                          to="/search"
                          className="btn btn-md lg:btn-lg btn-accent btn-outline"
                        >
                          Explore puzzles
                        </Link>
                        <Link
                          type="button"
                          to="/uploader"
                          className="btn btn-md lg:btn-lg btn-accent btn-outline"
                        >
                          Import puzzles
                        </Link>
                      </>
                    ) : (
                      <div className="m-4 opacity-80">
                        Go online for more features
                      </div>
                    )}
                  </div>
                  <Changelog />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 px-8 pb-8 shrink-0 xl:px-32 flex flex-col gap-8 max-w-[calc(320px*4+3rem)] box-content self-center [&>*]:shrink-0">
            {isOnline && (
              <Suspense fallback={<Loading />}>
                <FrontPageLists />
              </Suspense>
            )}
            {isOnline && me && (
              <Suspense fallback={<Loading />}>
                <PersonalFrontPageLists />
              </Suspense>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }),
});
