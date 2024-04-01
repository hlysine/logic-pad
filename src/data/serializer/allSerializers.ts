import { Puzzle } from '../puzzle';
import SerializerV0 from './serializer_v0';
import SerializerBase from './serializerBase';

const allSerializers = new Map<number, SerializerBase>();

function register<T extends SerializerBase>(prototype: T) {
  allSerializers.set(prototype.version, prototype);
}

let defaultSerializer: SerializerBase;

register((defaultSerializer = new SerializerV0()));

/**
 * The master serializer for puzzles.
 *
 * It uses the default serializer when stringifying puzzles, and select the correct deserializer when parsing puzzles.
 */
const Serializer = {
  /**
   * Convert a puzzle to a string.
   * @param puzzle The puzzle to convert.
   * @returns The string representation of the puzzle.
   */
  stringifyPuzzle(puzzle: Puzzle): string {
    return `${defaultSerializer.version}_${defaultSerializer.stringifyPuzzle(puzzle)}`;
  },
  /**
   * Parse a puzzle from a string.
   * @param input The string to parse.
   * @returns The parsed puzzle.
   */
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
