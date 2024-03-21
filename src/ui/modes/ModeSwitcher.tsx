import { memo } from 'react';
import ModeButton from './ModeButton';
import allModes from '../../allModes';
import { Mode } from '../../data/primitives';

// TODO: Buggy data transfer between modes

// const transferModePuzzle = (
//   _from: Mode,
//   _to: Mode,
//   fromPuzzle: Puzzle,
//   _toPuzzle: Puzzle
// ): Puzzle => {
//   return fromPuzzle;
// };

export interface ModeSwitcherProps {
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
}

export default memo(function ModeSwitcher({
  mode,
  onModeChange,
}: ModeSwitcherProps) {
  // const { grid, solution, metadata, setGridRaw, setMetadata } = useGrid();
  // const modePuzzles = useRef<Partial<Record<Mode, Puzzle | undefined>>>({});

  const modeChangeHandler = (newMode: Mode) => {
    if (newMode === mode) return;

    // const oldPuzzle = { grid, solution, ...metadata };

    // const newPuzzle = transferModePuzzle(
    //   mode,
    //   newMode,
    //   oldPuzzle,
    //   modePuzzles.current[newMode] ?? oldPuzzle
    // );

    // modePuzzles.current[mode] = oldPuzzle;
    // modePuzzles.current[newMode] = newPuzzle;
    // setGridRaw(newPuzzle.grid, newPuzzle.solution);
    // setMetadata(newPuzzle);
    onModeChange(newMode);
  };

  return (
    <div
      role="tablist"
      className="tabs tabs-boxed tabs-lg bg-base-100 shadow-lg"
    >
      {[...allModes.keys()].map(m => (
        <ModeButton
          key={m}
          active={mode === m}
          mode={m}
          onModeChange={modeChangeHandler}
        >
          {m}
        </ModeButton>
      ))}
    </div>
  );
});
