import { useEffect, useState } from 'react';
import { themeChange } from 'theme-change';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import GridContext from './ui/GridContext';
import EditContext from './ui/EditContext';
import SolveMode from './ui/modes/SolveMode';
import { Mode } from './data/primitives';
import { cn } from './utils';
import CreateMode from './ui/modes/CreateMode';

const SUPPORTED_THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
];

export default function App() {
  const [mode, setMode] = useState(Mode.Solve);

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <EditContext>
      <GridContext>
        <div className="h-dvh w-dvw overflow-auto bg-neutral">
          <Analytics />
          <SpeedInsights />
          <div className="flex flex-col items-stretch min-h-full w-full">
            <header className="flex justify-between items-center gap-4 px-8 py-2">
              <h1 className="text-3xl text-neutral-content">Logic Pad</h1>
              <div role="tablist" className="tabs tabs-boxed tabs-lg">
                <a
                  role="tab"
                  className={cn('tab', mode === Mode.Create && 'tab-active')}
                  onClick={() => setMode(Mode.Create)}
                >
                  Create
                </a>
                <a
                  role="tab"
                  className={cn('tab', mode === Mode.Solve && 'tab-active')}
                  onClick={() => setMode(Mode.Solve)}
                >
                  Solve
                </a>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">
                  Theme
                  <svg
                    width="12px"
                    height="12px"
                    className="h-2 w-2 fill-current opacity-60 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                  >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-[calc(100dvh-100px)] overflow-y-auto"
                >
                  {SUPPORTED_THEMES.map(theme => (
                    <li key={theme}>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label={theme}
                        value={theme}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </header>
            {mode === Mode.Create ? <CreateMode /> : <SolveMode />}
          </div>
        </div>
      </GridContext>
    </EditContext>
  );
}
