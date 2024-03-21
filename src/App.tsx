import { useState } from 'react';
import { Mode } from './data/primitives';
import Roadmap from './Roadmap';
import DevPuzzles, { DEV_PUZZLES } from './DevPuzzles';
import ThemeSwitcher from './ThemeSwitcher';
import allModes from './allModes';
import ModeSwitcher from './ui/modes/ModeSwitcher';
import EditContext from './ui/EditContext';
import GridContext from './ui/GridContext';

// million-ignore
export default function App() {
  const [mode, setMode] = useState(Mode.Solve);

  const ActiveMode = allModes.get(mode)!;

  return (
    <EditContext>
      <GridContext>
        <div className="h-dvh w-dvw overflow-auto bg-neutral">
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
              <ModeSwitcher mode={mode} onModeChange={setMode} />
              <div className="flex lg:basis-[320px] grow shrink justify-end">
                <ThemeSwitcher />
              </div>
            </header>
            <ActiveMode />
          </div>
        </div>
      </GridContext>
    </EditContext>
  );
}
