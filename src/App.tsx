import { useEffect, useState } from 'react';
import { themeChange } from 'theme-change';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import GridContext from './ui/GridContext';
import EditContext from './ui/EditContext';
import SolveMode from './ui/modes/SolveMode';
import { Mode } from './data/primitives';
import CreateMode from './ui/modes/CreateMode';
import ModeButton from './ui/modes/ModeButton';
import { FiChevronDown } from 'react-icons/fi';
import Roadmap from './Roadmap';
import DevPuzzles, { DEV_PUZZLES } from './DevPuzzles';

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
  }, []);

  return (
    <EditContext>
      <GridContext>
        <div className="h-dvh w-dvw overflow-auto bg-neutral">
          <Analytics />
          <SpeedInsights />
          <div className="flex flex-col items-stretch min-h-full w-full">
            <header className="flex flex-wrap justify-between items-stretch gap-4 px-8 py-2">
              <div className="flex flex-wrap grow shrink items-center gap-4">
                <h1 className="text-3xl text-neutral-content">Logic Pad</h1>
                <ul className="menu menu-horizontal bg-base-200 rounded-box">
                  <li className="dropdown dropdown-bottom">
                    <div tabIndex={0} role="button">
                      Dev Puzzles{' '}
                      <span className="badge badge-accent">
                        {DEV_PUZZLES.length}
                      </span>
                    </div>
                    <DevPuzzles />
                  </li>
                  <li className="dropdown dropdown-bottom">
                    <div tabIndex={0} role="button">
                      Roadmap
                    </div>
                    <Roadmap />
                  </li>
                </ul>
              </div>
              <div
                role="tablist"
                className="tabs tabs-boxed tabs-lg bg-base-100 shadow-lg"
              >
                <ModeButton
                  active={mode === Mode.Create}
                  mode={Mode.Create}
                  onModeChange={setMode}
                >
                  Create
                </ModeButton>
                <ModeButton
                  active={mode === Mode.Solve}
                  mode={Mode.Solve}
                  onModeChange={setMode}
                >
                  Solve
                </ModeButton>
              </div>
              <div className="flex lg:basis-[320px] grow shrink justify-end">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn m-1">
                    Theme
                    <FiChevronDown />
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
              </div>
            </header>
            {mode === Mode.Create ? <CreateMode /> : <SolveMode />}
          </div>
        </div>
      </GridContext>
    </EditContext>
  );
}
