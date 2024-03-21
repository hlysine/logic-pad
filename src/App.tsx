import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import GridContext from './ui/GridContext';
import EditContext from './ui/EditContext';
import SolveMode from './ui/modes/SolveMode';
import { Mode } from './data/primitives';
import CreateMode from './ui/modes/CreateMode';
import ModeButton from './ui/modes/ModeButton';
import Roadmap from './Roadmap';
import DevPuzzles, { DEV_PUZZLES } from './DevPuzzles';
import ThemeSwitcher from './ThemeSwitcher';

export default function App() {
  const [mode, setMode] = useState(Mode.Solve);

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
                <ThemeSwitcher />
              </div>
            </header>
            {mode === Mode.Create ? <CreateMode /> : <SolveMode />}
          </div>
        </div>
      </GridContext>
    </EditContext>
  );
}
