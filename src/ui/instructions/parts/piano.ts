import MusicGridRule from '../../../data/rules/musicGridRule';
import { Piano } from '@tonejs/piano';
import GridData from '../../../data/grid';
import * as Tone from 'tone';
import { Color } from '../../../data/primitives';

type EventData =
  | { type: 'pedal'; value: boolean }
  | { type: 'keydown'; value: string; velocity: number }
  | { type: 'keyup'; value: string }
  | { type: 'bpm'; value: number }
  | { type: 'stopAll' };

export const piano = new Piano({
  release: false,
  pedal: false,
  velocities: 5,
  maxPolyphony: 64,
}).toDestination();

export function encodePlayback(
  grid: GridData,
  musicGrid: MusicGridRule,
  oldGrid?: GridData
): () => void {
  // prepare events
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
    const getTime = (time: number) => {
      if (oldGrid) return time - x / 2;
      return time;
    };
    const line = musicGrid.controlLines.find(line => line.column === x);
    if (line) {
      if (line.bpm !== undefined && line.bpm !== bpm) {
        addEvent(getTime(x / 2), { type: 'bpm', value: line.bpm });
        bpm = line.bpm;
      }
      if (line.pedal !== undefined && line.pedal !== pedal) {
        addEvent(getTime(x / 2), { type: 'pedal', value: line.pedal });
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
      const oldTile = oldGrid?.getTile(x, y);
      if (
        tile.exists &&
        tile.color === Color.Dark &&
        (!oldTile || !oldTile.exists || oldTile.color !== Color.Dark) &&
        !grid.connections.isConnected({ x1: x, y1: y, x2: x - 1, y2: y })
      ) {
        addEvent(getTime(x / 2), {
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
        addEvent(getTime((endPos.x + 1) / 2), {
          type: 'keyup',
          value: row.note,
        });
      }
    });
  }

  // reset bpm to 120 before encoding because the time values are bpm-dependent
  Tone.getTransport().bpm.value = 120;

  // create part
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
          case 'stopAll':
            piano.stopAll();
            break;
        }
      });
    },
    [...events.entries()]
  ).start(0);

  // return clean-up function
  return () => {
    notes.dispose();
  };
}

export interface CachedPlayback {
  grid: GridData | null;
  cleanUp: () => void;
}

export function playGrid(
  grid: GridData,
  musicGrid: MusicGridRule,
  cache?: CachedPlayback,
  oldGrid?: GridData
): CachedPlayback {
  Tone.getTransport().stop();
  piano.stopAll();
  if (!cache?.grid?.equals(grid)) {
    cache?.cleanUp?.();
    cache = {
      grid,
      cleanUp: encodePlayback(grid, musicGrid, oldGrid),
    };
  }
  Tone.getTransport().start();
  return cache;
}

export function cleanUp(cache?: CachedPlayback) {
  cache?.cleanUp();
  Tone.getTransport().stop();
  piano.stopAll();
}
