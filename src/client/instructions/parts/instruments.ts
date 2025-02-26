import MusicGridRule from '@logic-pad/core/data/rules/musicGridRule';
import { Piano } from '@hlysine/piano';
import GridData from '@logic-pad/core/data/grid';
import * as Tone from 'tone';
import { Color } from '@logic-pad/core/data/primitives';

type EventData =
  | { type: 'pedal'; value: boolean }
  | { type: 'keydown'; value: string; velocity: number }
  | { type: 'keyup'; value: string }
  | { type: 'bpm'; value: number }
  | { type: 'complete' };

export const playbackState = {
  /**
   * Indicates that the current playback is a solution, thus the tile animations should be disabled.
   */
  isSolution: false,
  checkpoint: 0,
  playback: undefined as CachedPlayback | undefined,
};

export const piano = new Piano({
  release: false,
  pedal: false,
  velocities: 1,
  maxPolyphony: 32,
}).toDestination();

export const pianoImmediatePedal = new Piano({
  release: false,
  pedal: false,
  velocities: 1,
  maxPolyphony: 32,
}).toDestination();

export const pianoImmediate = new Piano({
  release: false,
  pedal: false,
  velocities: 1,
  maxPolyphony: 32,
}).toDestination();

export const drum = {
  snare: new Tone.Player('/samples/snare.wav').toDestination(),
  kick: new Tone.Player('/samples/kick.wav').toDestination(),
  hihat: new Tone.Player('/samples/hihat.wav').toDestination(),
  'hihat-open': new Tone.Player('/samples/hihat-open.wav').toDestination(),
  crash: new Tone.Player('/samples/crash.wav').toDestination(),
  tom: new Tone.Player('/samples/tom.wav').toDestination(),
  rim: new Tone.Player('/samples/rim.wav').toDestination(),
};

const c5Midi = Tone.Midi('C5').toMidi();
const e4Midi = Tone.Midi('E4').toMidi();
const e3Midi = Tone.Midi('E3').toMidi();
const e2Midi = Tone.Midi('E2').toMidi();

function normalizeVelocity(
  velocity: number,
  note: string,
  applyNormalization: boolean
): number {
  if (!applyNormalization) return velocity;
  // the default velocity is 0.5 but drum samples are louder so their base velocity is 0.7
  if (note in drum) return (velocity - 0.7) * 20;
  const midi = Tone.Midi(note).toMidi();
  velocity += 0.2;
  if (midi > c5Midi) return velocity;
  velocity -= 0.2;
  if (midi > e4Midi) return velocity;
  velocity -= 0.05;
  if (midi > e3Midi) return velocity;
  velocity -= 0.03;
  if (midi > e2Midi) return velocity;
  velocity -= 0.01;
  return velocity;
}

export function encodePlayback(
  grid: GridData,
  musicGrid: MusicGridRule,
  onComplete?: () => void
): () => void {
  // prepare events
  let bpm = 120;
  let pedal = false;
  const rows: {
    note: string | null;
    velocity: number | null;
  }[] = Array.from({ length: grid.height }, () => ({
    note: null,
    velocity: 0.5,
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
      if (line.bpm !== null && line.bpm !== bpm) {
        addEvent(x / 2, { type: 'bpm', value: line.bpm });
        bpm = line.bpm;
      }
      if (line.pedal !== null && line.pedal !== pedal) {
        addEvent(x / 2, { type: 'pedal', value: line.pedal });
        pedal = line.pedal;
      }
      line.rows.forEach((row, j) => {
        if (j >= rows.length) return;
        if (row.note !== null) {
          rows[j].note = row.note;
        }
        if (row.velocity !== null) {
          rows[j].velocity = row.velocity;
        }
      });
    }
    rows.forEach((row, y) => {
      if (row.note === null || row.velocity === null) return;
      const tile = grid.getTile(x, y);
      if (
        tile.exists &&
        tile.color === Color.Dark &&
        !grid.connections.hasEdge({ x1: x, y1: y, x2: x - 1, y2: y })
      ) {
        addEvent(x / 2, {
          type: 'keydown',
          value: row.note,
          velocity: row.velocity,
        });
        let endPos = { x, y };
        while (
          grid.connections.hasEdge({
            x1: endPos.x,
            y1: endPos.y,
            x2: endPos.x + 1,
            y2: endPos.y,
          })
        ) {
          endPos = { x: endPos.x + 1, y: endPos.y };
        }
        addEvent((endPos.x + 1) / 2, {
          type: 'keyup',
          value: row.note,
        });
      }
    });
  }
  addEvent(grid.width / 2, { type: 'complete' });

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
            if (event.value in drum) {
              drum[event.value as keyof typeof drum].volume.setValueAtTime(
                normalizeVelocity(
                  event.velocity,
                  event.value,
                  musicGrid.normalizeVelocity
                ),
                time
              );
              drum[event.value as keyof typeof drum].start(time, 0);
            } else {
              piano.keyDown({
                note: event.value,
                velocity: normalizeVelocity(
                  event.velocity,
                  event.value,
                  musicGrid.normalizeVelocity
                ),
                time,
              });
            }
            break;
          case 'keyup':
            if (event.value in drum) {
              drum[event.value as keyof typeof drum].stop(time);
            } else {
              piano.keyUp({
                note: event.value,
                time,
              });
            }
            break;
          case 'complete':
            onComplete?.();
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

export function encodeImmediate(
  grid: GridData,
  oldGrid: GridData,
  musicGrid: MusicGridRule
) {
  // set the piano to the correct state
  pianoImmediate.pedalUp();
  pianoImmediatePedal.pedalDown();

  // a small hack to hide the progress line if no grid is currently playing
  if (Tone.getTransport().state !== 'started')
    Tone.getTransport().ticks = Tone.getTransport().PPQ * grid.width * 2;

  let remainingPolyphony = 2;

  // prepare events
  let bpm = 120;
  let pedal = false;
  const rows: {
    note: string | null;
    velocity: number | null;
  }[] = Array.from({ length: grid.height }, () => ({
    note: null,
    velocity: 0.5,
  }));

  for (let x = 0; x < grid.width; x++) {
    const line = musicGrid.controlLines.find(line => line.column === x);
    if (line) {
      if (line.bpm !== null && line.bpm !== bpm) {
        bpm = line.bpm;
      }
      if (line.pedal !== null && line.pedal !== pedal) {
        pedal = line.pedal;
      }
      line.rows.forEach((row, j) => {
        if (j >= rows.length) return;
        if (row.note !== null) {
          rows[j].note = row.note;
        }
        if (row.velocity !== null) {
          rows[j].velocity = row.velocity;
        }
      });
    }
    rows.forEach((row, y) => {
      if (row.note === null || row.velocity === null) return;
      if (remainingPolyphony <= 0) return;
      const tile = grid.getTile(x, y);
      const oldTile = oldGrid.getTile(x, y);
      if (
        tile.exists &&
        tile.color === Color.Dark &&
        (!oldTile.exists || oldTile.color !== Color.Dark) &&
        !grid.connections.hasEdge({ x1: x, y1: y, x2: x - 1, y2: y })
      ) {
        const targetPiano = pedal ? pianoImmediatePedal : pianoImmediate;
        if (row.note in drum) {
          drum[row.note as keyof typeof drum].volume.setValueAtTime(
            normalizeVelocity(
              row.velocity,
              row.note,
              musicGrid.normalizeVelocity
            ),
            0
          );
          drum[row.note as keyof typeof drum].start(0, 0);
        } else {
          targetPiano.keyDown({
            note: row.note,
            velocity: normalizeVelocity(
              row.velocity,
              row.note,
              musicGrid.normalizeVelocity
            ),
          });
        }
        remainingPolyphony--;
        let endPos = { x, y };
        while (
          grid.connections.hasEdge({
            x1: endPos.x,
            y1: endPos.y,
            x2: endPos.x + 1,
            y2: endPos.y,
          })
        ) {
          endPos = { x: endPos.x + 1, y: endPos.y };
        }
        const time = `+${(((endPos.x + 1) / 2 - x / 2) * 120 * 120) / Tone.getTransport().bpm.value / bpm}`;
        if (row.note in drum) {
          drum[row.note as keyof typeof drum].stop(time);
        } else {
          targetPiano.keyUp({
            note: row.note,
            velocity: row.velocity,
            time,
          });
        }
      }
    });
  }
}

export interface CachedPlayback {
  grid: GridData | null;
  cleanUp: () => void;
}

export function playGrid(
  grid: GridData,
  musicGrid: MusicGridRule,
  isSolution: boolean,
  onComplete?: () => void,
  cache?: CachedPlayback
): CachedPlayback {
  playbackState.isSolution = isSolution;
  Tone.getTransport().stop();
  piano.stopAll();
  if (!cache?.grid?.equals(grid)) {
    cache?.cleanUp?.();
    cache = {
      grid,
      cleanUp: encodePlayback(grid, musicGrid, onComplete),
    };
  }
  Tone.getTransport().start();
  Tone.getTransport().ticks =
    playbackState.checkpoint * Tone.getTransport().PPQ;
  Tone.getTransport().bpm.value = musicGrid.controlLines
    .filter(line => line.column <= playbackState.checkpoint)
    .reduce((a, b) => b.bpm ?? a, 120);
  const pedal = musicGrid.controlLines
    .filter(line => line.column <= playbackState.checkpoint)
    .reduce((a, b) => b.pedal ?? a, false);
  if (pedal) {
    piano.pedalDown();
  } else {
    piano.pedalUp();
  }
  return cache;
}

export function playImmediate(
  grid: GridData,
  oldGrid: GridData,
  musicGrid: MusicGridRule
) {
  encodeImmediate(grid, oldGrid, musicGrid);
  Tone.getTransport().start();
}

export function cleanUp(cache?: CachedPlayback) {
  cache?.cleanUp();
  if (cache) cache.grid = null;
  Tone.getTransport().stop();
  piano.stopAll();
}
