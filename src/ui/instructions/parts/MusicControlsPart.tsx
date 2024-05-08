import { Suspense, lazy, memo, useRef } from 'react';
import { useGrid } from '../../GridContext';
import { InstructionPartProps, PartPlacement, PartSpec } from './types';
import MusicGridRule, {
  instance as musicGridInstance,
} from '../../../data/rules/musicGridRule';
import { RiHeadphoneFill } from 'react-icons/ri';
import { FaPlay } from 'react-icons/fa';
import { Piano } from '@tonejs/piano';
import Loading from '../../components/Loading';
import GridData from '../../../data/grid';
import * as Tone from 'tone';
import { Color } from '../../../data/primitives';
import { array } from '../../../data/helper';

export type MusicControlsPartProps = InstructionPartProps<MusicGridRule>;

type EventData =
  | { type: 'pedal'; value: boolean }
  | { type: 'keydown'; value: string; velocity: number }
  | { type: 'keyup'; value: string }
  | { type: 'bpm'; value: number };

const piano = new Piano({
  release: false,
  pedal: true,
  velocities: 5,
  maxPolyphony: 64,
});

function encodePlayback(grid: GridData, musicGrid: MusicGridRule): () => void {
  let bpm: number | undefined;
  let pedal: boolean | undefined;
  const rows: {
    note: string | undefined;
    velocity: number | undefined;
  }[] = Array.from({ length: grid.height }, () => ({
    note: undefined,
    velocity: undefined,
  }));
  const events = new Map<Tone.Unit.Time, EventData[]>();
  const addEvent = (time: Tone.Unit.Time, event: EventData) => {
    const existing = events.get(time);
    if (existing) {
      existing.push(event);
    } else {
      events.set(time, [event]);
    }
  };
  for (let x = 0; x < grid.width; x++) {
    const line = musicGrid.controlLines.find(line => line.column === x);
    if (line) {
      if (line.bpm !== undefined && line.bpm !== bpm) {
        addEvent(`${x / 2}`, { type: 'bpm', value: line.bpm });
        bpm = line.bpm;
      }
      if (line.pedal !== undefined && line.pedal !== pedal) {
        addEvent(`${x / 2}`, { type: 'pedal', value: line.pedal });
        pedal = line.pedal;
      }
      line.rows.forEach((row, j) => {
        if (j >= rows.length) return;
        if (row.note !== undefined) {
          rows[j].note = row.note;
        }
        if (row.velocity !== undefined) {
          rows[j].velocity = row.velocity;
        }
      });
    }
    rows.forEach((row, y) => {
      if (row.note === undefined || row.velocity === undefined) return;
      const tile = grid.getTile(x, y);
      if (
        tile.exists &&
        tile.color === Color.Dark &&
        !grid.connections.isConnected({ x1: x, y1: y, x2: x - 1, y2: y })
      ) {
        addEvent(`${x / 2}`, {
          type: 'keydown',
          value: row.note,
          velocity: row.velocity,
        });
        let endPos = { x, y };
        while (
          grid.connections.isConnected({
            x1: endPos.x,
            y1: endPos.y,
            x2: endPos.x + 1,
            y2: endPos.y,
          })
        ) {
          endPos = { x: endPos.x + 1, y: endPos.y };
        }
        addEvent(`${(endPos.x + 1) / 2}`, {
          type: 'keyup',
          value: row.note,
        });
      }
    });
  }
  const notes = new Tone.Part(
    (time, event) => {
      event.forEach(event => {
        switch (event.type) {
          case 'bpm':
            Tone.getTransport().bpm.setValueAtTime(event.value, time);
            break;
          case 'pedal':
            if (event.value) {
              piano.pedalDown({ time });
            } else {
              piano.pedalUp({ time });
            }
            break;
          case 'keydown':
            piano.keyDown({
              note: event.value,
              velocity: event.velocity,
              time,
            });
            break;
          case 'keyup':
            piano.keyUp({ note: event.value, time });
            break;
        }
      });
    },
    [...events.entries()]
  ).start(0);
  piano.toDestination();
  return () => {
    notes.stop();
    notes.cancel();
    notes.clear();
    notes.dispose();
  };
}

const MusicControls = lazy(async function () {
  await piano.load();
  return {
    default: memo(function MusicControls({
      instruction,
    }: MusicControlsPartProps) {
      const { grid, solution } = useGrid();
      const playback = useRef<{ grid: GridData; cleanUp: () => void } | null>(
        null
      );
      return (
        <>
          <button
            type="button"
            className="btn btn-ghost text-lg"
            onClick={() => {
              Tone.getTransport().stop();
              Tone.getTransport().seconds = 0;
              const tiles = array(
                solution?.width ?? grid.width,
                solution?.height ?? grid.height,
                (x, y) => {
                  const gridTile = grid.getTile(x, y);
                  if (!solution) return gridTile;
                  const tile = solution.getTile(x, y);
                  if (tile.exists && tile.color !== Color.Gray) return tile;
                  return gridTile;
                }
              );
              const newGrid = grid.withTiles(tiles);
              if (!playback.current?.grid.equals(newGrid)) {
                playback.current?.cleanUp?.();
                playback.current = {
                  grid: newGrid,
                  cleanUp: encodePlayback(newGrid, instruction),
                };
              }
              Tone.getTransport().start();
            }}
          >
            <RiHeadphoneFill />
            Listen
          </button>
          <button type="button" className="btn btn-ghost text-lg">
            <FaPlay />
            Play
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
