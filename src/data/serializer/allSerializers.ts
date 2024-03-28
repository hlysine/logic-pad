import Puzzle from '../puzzle';
import SerializerV0 from './serializer_v0';
import SerializerBase from './serializerBase';

const allSerializers = new Map<number, SerializerBase>();

function register<T extends SerializerBase>(prototype: T) {
  allSerializers.set(prototype.version, prototype);
}

let defaultSerializer: SerializerBase;

register((defaultSerializer = new SerializerV0()));

const Serializer = {
  stringifyPuzzle(puzzle: Puzzle): string {
    return defaultSerializer.stringifyPuzzle(puzzle);
  },
  parsePuzzle(input: string): Puzzle {
    const match = input.match(/^(\d+)_/);
    const version = match ? parseInt(match[1]) : 0;
    const serializer = allSerializers.get(version);
    if (serializer) {
      return serializer.parsePuzzle(input.slice(match?.[0].length ?? 0));
    } else {
      throw new Error(`Unknown serializer version for ${input}`);
    }
  },
};

export default Serializer;
