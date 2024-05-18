import { Link, createFileRoute } from '@tanstack/react-router';
import { memo, useRef, useState } from 'react';
import QuickAccessBar from '../ui/components/QuickAccessBar';
import Grid from '../ui/grid/Grid';
import GridData from '../data/grid';
import GridConnections from '../data/gridConnections';
import CuratedPuzzles from '../ui/components/CuratedPuzzles';
import { puzzleTypeFilters } from '../ui/components/PuzzleCard';

const grid = GridData.create([
  '.nwww',
  'nnwbb',
  'nnwbw',
  'nnBwW',
  '.nnn.',
]).withConnections(
  GridConnections.create(['..aaa', '..abb', '..ab.', '.....', '.....'])
);

export const Route = createFileRoute('/')({
  component: memo(function Home() {
    const curatedPuzzles = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<string>('All');
    return (
      <>
        <div className="flex flex-col min-h-dvh shrink-0">
          <QuickAccessBar className="justify-end px-8 py-2" />
          <div className="flex flex-col xl:flex-row grow gap-32 items-center justify-center p-16 z-10">
            <div className="relative order-1 grow shrink self-stretch overflow-visible pointer-events-none -z-10 min-h-64 m-16">
              <Grid
                type="canvas"
                size={100}
                grid={grid}
                editable={false}
                className="absolute left-1/2 xl:right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink -rotate-[5deg] opacity-75"
              />
            </div>
            <div className="flex flex-wrap shrink-0 grow-0 justify-center gap-8">
              <div className="relative w-32 h-32 inline-block">
                <div className="absolute w-0 h-0 top-1/2 left-1/2 logo-glow"></div>
                <img src="/logo.svg" className="absolute inset-0" />
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-accent text-4xl lg:text-6xl font-medium">
                  Logic Pad
                </span>
                <span className="text-xl lg:text-2xl">
                  A modern, open-source web app for grid-based puzzles.
                </span>
                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <Link
                    to="/create"
                    className="btn btn-md lg:btn-lg btn-accent"
                  >
                    Create your own puzzle
                  </Link>
                  <button
                    type="button"
                    className="btn btn-md lg:btn-lg btn-accent btn-outline"
                    onClick={() =>
                      curatedPuzzles.current?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }
                  >
                    Check out some examples
                  </button>
                </div>
                {/* <button className="btn btn-ghost mt-16 flex flex-col flex-nowrap justify-center items-stretch gap-8 text-left p-4 h-fit border-y border-x-0 border-accent">
                  <div className="flex gap-4 items-center flex-wrap">
                    <GrNew size={24} className="text-accent" />
                    <h3 className="font-bold text-xl">New updates</h3>
                    <span>17/5/2024</span>
                    <div className="flex-1"></div>
                    <span className="opacity-70">View changelog &gt;&gt;</span>
                  </div>
                  <Markdown>{dedent`
                  - Added landing page
                  - Added landing page
                `}</Markdown>
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div
          ref={curatedPuzzles}
          className="mt-8 px-8 pb-8 shrink-0 xl:px-32 flex flex-col gap-8 min-h-dvh"
        >
          <div className="flex justify-between items-start flex-wrap">
            <h3 className="text-2xl lg:text-4xl">Curated Puzzles</h3>
            <ul className="menu menu-vertical md:menu-horizontal bg-base-200/50 text-base-content rounded-box">
              {puzzleTypeFilters.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <a
                    className={name === filter ? 'bg-base-300' : ''}
                    onClick={() => setFilter(name)}
                  >
                    <Icon />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-8 justify-center items-center">
            <CuratedPuzzles filter={filter} />
          </div>
        </div>
      </>
    );
  }),
});
