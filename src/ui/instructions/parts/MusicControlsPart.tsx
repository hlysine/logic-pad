import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react';
import { useGrid } from '../../GridContext';
import { InstructionPartProps, PartPlacement, PartSpec } from './types';
import MusicGridRule, {
  instance as musicGridInstance,
} from '../../../data/rules/musicGridRule';
import { RiHeadphoneFill, RiStopLargeFill } from 'react-icons/ri';
import { FaPlay } from 'react-icons/fa';
import Loading from '../../components/Loading';
import { Color } from '../../../data/primitives';
import { array } from '../../../data/helper';
import {
  CachedPlayback,
  cleanUp,
  piano,
  pianoImmediate,
  pianoImmediatePedal,
  playGrid,
  playImmediate,
} from './piano';
import GridData from '../../../data/grid';

export type MusicControlsPartProps = InstructionPartProps<MusicGridRule>;

const MusicControls = lazy(async function () {
  await piano.load();
  await pianoImmediate.load();
  await pianoImmediatePedal.load();
  return {
    default: memo(function MusicControls({
      instruction,
    }: MusicControlsPartProps) {
      const { grid, solution } = useGrid();
      const playback = useRef<CachedPlayback | undefined>(undefined);
      const previousGrid = useRef<GridData | null>(null);
      const [playState, setPlayState] = useState<'listen' | 'play' | 'none'>(
        'none'
      );

      useEffect(() => {
        if (previousGrid.current && !previousGrid.current.colorEquals(grid)) {
          playImmediate(grid, previousGrid.current, instruction);
        }
        previousGrid.current = grid;
      }, [grid, instruction]);

      const stopAll = (playback: CachedPlayback | undefined) => {
        cleanUp(playback);
        setPlayState('none');
      };

      useEffect(() => {
        return () => stopAll(playback.current);
      }, []);

      useEffect(() => {
        stopAll(playback.current);
      }, [grid.width, grid.height]);

      return (
        <>
          {(instruction.track ?? solution) && (
            <button
              type="button"
              className="btn btn-ghost text-lg"
              onClick={() => {
                if (playState === 'listen') {
                  stopAll(playback.current);
                } else {
                  if (instruction.track) {
                    const musicGrid = instruction.track.findRule(
                      r => r.id === musicGridInstance.id
                    ) as MusicGridRule | undefined;
                    if (!musicGrid) return;
                    playback.current = playGrid(
                      instruction.track,
                      musicGrid,
                      true,
                      () => setPlayState('none'),
                      playback.current
                    );
                  } else {
                    const tiles = array(
                      solution?.width ?? grid.width,
                      solution?.height ?? grid.height,
                      (x, y) => {
                        const gridTile = grid.getTile(x, y);
                        if (!solution) return gridTile;
                        const tile = solution.getTile(x, y);
                        if (tile.exists && tile.color !== Color.Gray)
                          return tile;
                        return gridTile;
                      }
                    );
                    playback.current = playGrid(
                      grid.withTiles(tiles),
                      instruction,
                      true,
                      () => setPlayState('none'),
                      playback.current
                    );
                  }
                  setPlayState('listen');
                }
              }}
            >
              {playState === 'listen' ? (
                <>
                  <RiStopLargeFill />
                  Stop
                </>
              ) : (
                <>
                  <RiHeadphoneFill />
                  Listen
                </>
              )}
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost text-lg"
            onClick={() => {
              if (playState === 'play') {
                stopAll(playback.current);
              } else {
                playback.current = playGrid(
                  grid,
                  instruction,
                  false,
                  () => setPlayState('none'),
                  playback.current
                );
                setPlayState('play');
              }
            }}
          >
            {playState === 'play' ? (
              <>
                <RiStopLargeFill />
                Stop
              </>
            ) : (
              <>
                <FaPlay />
                Play
              </>
            )}
          </button>
        </>
      );
    }),
  };
});

export default memo(function MusicControlsPart({
  instruction,
}: MusicControlsPartProps) {
  return (
    <div className="grow-0 shrink-0 bg-primary/10 flex justify-around">
      <Suspense fallback={<Loading />}>
        <MusicControls instruction={instruction} />
      </Suspense>
    </div>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.LeftPanel,
  instructionId: musicGridInstance.id,
};
