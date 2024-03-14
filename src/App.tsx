import Grid from './ui/Grid';
import GridData from './data/grid';
import { useEffect, useState } from 'react';
import { Color } from './data/primitives';
import LetterSymbol from './data/symbols/letterSymbol';
import InstructionList from './ui/InstructionList';
import NumberSymbol from './data/symbols/numberSymbol';
import ConnectAllRule from './data/rules/connectAllRule';
import { themeChange } from 'theme-change';

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
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  const [grid, setGrid] = useState(
    new GridData(10, 10)
      .addRule(new ConnectAllRule(Color.Dark))
      .addRule(new ConnectAllRule(Color.Light))
      .addSymbol(new NumberSymbol(0, 0, 5))
      .addSymbol(new NumberSymbol(0, 9, 5))
      .addSymbol(new NumberSymbol(9, 0, 5))
      .addSymbol(new NumberSymbol(9, 9, 5))
      .setTile(1, 0, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(3, 0, t => t.withFixed(true).withColor(Color.Dark))
      .addSymbol(new LetterSymbol(3, 0, 'A'))
      .setTile(6, 0, t => t.withFixed(true).withColor(Color.Light))
      .addSymbol(new LetterSymbol(6, 0, 'B'))
      .setTile(1, 1, t => t.withFixed(true).withColor(Color.Light))
      .setTile(3, 1, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(5, 1, t => t.withFixed(true).withColor(Color.Light))
      .setTile(9, 1, t => t.withFixed(true).withColor(Color.Light))
      .setTile(2, 2, t => t.withFixed(true).withColor(Color.Light))
      .setTile(4, 2, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(6, 2, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(7, 2, t => t.withFixed(true).withColor(Color.Light))
      .setTile(0, 3, t => t.withFixed(true).withColor(Color.Light))
      .addSymbol(new LetterSymbol(0, 3, 'C'))
      .setTile(6, 3, t => t.withFixed(true).withColor(Color.Light))
      .setTile(7, 3, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(9, 3, t => t.withFixed(true).withColor(Color.Dark))
      .addSymbol(new LetterSymbol(9, 3, 'D'))
      .setTile(1, 4, t => t.withFixed(true).withColor(Color.Light))
      .setTile(4, 4, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(5, 4, t => t.withFixed(true).withColor(Color.Light))
      .setTile(8, 4, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(1, 5, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(4, 5, t => t.withFixed(true).withColor(Color.Light))
      .setTile(5, 5, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(8, 5, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(0, 6, t => t.withFixed(true).withColor(Color.Dark))
      .addSymbol(new LetterSymbol(0, 6, 'E'))
      .setTile(2, 6, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(3, 6, t => t.withFixed(true).withColor(Color.Light))
      .setTile(9, 6, t => t.withFixed(true).withColor(Color.Light))
      .addSymbol(new LetterSymbol(9, 6, 'F'))
      .setTile(2, 7, t => t.withFixed(true).withColor(Color.Light))
      .setTile(3, 7, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(5, 7, t => t.withFixed(true).withColor(Color.Light))
      .setTile(7, 7, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(0, 8, t => t.withFixed(true).withColor(Color.Light))
      .setTile(4, 8, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(6, 8, t => t.withFixed(true).withColor(Color.Light))
      .setTile(8, 8, t => t.withFixed(true).withColor(Color.Dark))
      .setTile(3, 9, t => t.withFixed(true).withColor(Color.Light))
      .addSymbol(new LetterSymbol(3, 9, 'G'))
      .setTile(6, 9, t => t.withFixed(true).withColor(Color.Dark))
      .addSymbol(new LetterSymbol(6, 9, 'H'))
      .setTile(8, 9, t => t.withFixed(true).withColor(Color.Light))
  );
  return (
    <div className="h-dvh w-dvw overflow-scroll bg-neutral">
      <div className="flex flex-col items-stretch min-h-full w-full">
        <header className="flex justify-start items-center gap-4 p-4">
          <h1 className="text-3xl text-neutral-content">Logic Pad</h1>
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
        <div className="flex flex-1 justify-center items-center flex-wrap">
          <div className="w-[320px]"></div>
          <div className="grow shrink flex justify-start items-center overflow-x-auto overflow-y-hidden p-0">
            <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
              <Grid
                size={60}
                grid={grid}
                editable={true}
                onTileClick={(x, y, target) =>
                  setGrid(grid => grid.setTile(x, y, t => t.withColor(target)))
                }
              />
            </div>
          </div>
          <InstructionList data={grid} />
        </div>
      </div>
    </div>
  );
}
