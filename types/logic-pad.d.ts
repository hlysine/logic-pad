declare global {
// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../../../zod

import { z } from 'zod';

export enum ConfigType {
    Number = "number",
    String = "string",
    Color = "color",
    Direction = "direction",
    Grid = "grid"
}
export interface Config<T> {
    readonly type: ConfigType;
    readonly field: string;
    readonly description: string;
    readonly default: T;
    readonly configurable: boolean;
}
export interface NumberConfig extends Config<number> {
    readonly type: ConfigType.Number;
    readonly min?: number;
    readonly max?: number;
}
export interface StringConfig extends Config<string> {
    readonly type: ConfigType.String;
    readonly maxLength?: number;
}
export interface ColorConfig extends Config<Color> {
    readonly type: ConfigType.Color;
    readonly allowGray: boolean;
}
export interface DirectionConfig extends Config<Direction> {
    readonly type: ConfigType.Direction;
}
export interface GridConfig extends Config<GridData> {
    readonly type: ConfigType.Grid;
}
export type AnyConfig = NumberConfig | StringConfig | ColorConfig | DirectionConfig | GridConfig;

export class GridData {
    readonly width: number;
    readonly height: number;
    readonly tiles: readonly (readonly TileData[])[];
    readonly connections: GridConnections;
    readonly symbols: ReadonlyMap<string, readonly Symbol[]>;
    readonly rules: readonly Rule[];
    constructor(width: number, height: number, tiles?: readonly (readonly TileData[])[], connections?: GridConnections, symbols?: ReadonlyMap<string, readonly Symbol[]>, rules?: readonly Rule[]);
    copyWith({ width, height, tiles, connections, symbols, rules, }: {
        width?: number;
        height?: number;
        tiles?: readonly (readonly TileData[])[];
        connections?: GridConnections;
        symbols?: ReadonlyMap<string, readonly Symbol[]>;
        rules?: readonly Rule[];
    }): GridData;
    getTile(x: number, y: number): TileData;
    setTile(x: number, y: number, tile: TileData | ((tile: TileData) => TileData)): GridData;
    withConnections(connections: GridConnections | ((value: GridConnections) => GridConnections)): GridData;
    withSymbols(symbols: ReadonlyMap<string, readonly Symbol[]> | ((value: Map<string, readonly Symbol[]>) => ReadonlyMap<string, readonly Symbol[]>)): GridData;
    addSymbol(symbol: Symbol): GridData;
    removeSymbol(symbol: Symbol): GridData;
    withRules(rules: readonly Rule[] | ((value: readonly Rule[]) => readonly Rule[])): GridData;
    addRule(rule: Rule): GridData;
    removeRule(rule: Rule): GridData;
    replaceRule(oldRule: Rule, newRule: Rule): GridData;
    resize(width: number, height: number): GridData;
    static create(array: string[]): GridData;
    find(predicate: (tile: TileData, x: number, y: number) => boolean): Position | undefined;
    iterateArea<T>(position: Position, predicate: (tile: TileData) => boolean, callback: (tile: TileData, x: number, y: number) => undefined | T): T | undefined;
    iterateDirection<T>(position: Position, direction: Direction, predicate: (tile: TileData) => boolean, callback: (tile: TileData, x: number, y: number) => T | undefined): T | undefined;
    isComplete(): boolean;
    forEach(callback: (tile: TileData, x: number, y: number) => void): void;
    floodFill(position: Position, from: Color, to: Color): GridData;
    floodFillAll(from: Color, to: Color): GridData;
    resetTiles(): GridData;
}

export class GridConnections {
    readonly edges: readonly Edge[];
    constructor(edges?: readonly Edge[]);
    addEdge(edge: Edge): GridConnections;
    removeEdge(edge: Edge): GridConnections;
    isConnected(edge: Edge): boolean;
    getConnectionsAt({ x, y }: Position): readonly Edge[];
    getForTile({ x, y }: Position): TileConnections;
    getConnectedTiles({ x, y }: Position): readonly Position[];
    static create(array: string[]): GridConnections;
}

export function move(position: Position, direction: Direction): {
    x: number;
    y: number;
};
export function array<T>(width: number, height: number, value: (x: number, y: number) => T): T[][];
export function minBy<T>(values: readonly T[], mapper: (element: T) => number): T | undefined;
export function maxBy<T>(values: readonly T[], mapper: (element: T) => number): T | undefined;
export function escape(text: string): string;
export function unescape(text: string): string;

export abstract class Instruction {
    abstract get id(): string;
    abstract get explanation(): string;
    abstract createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    abstract copyWith(props: Record<string, unknown>): this;
    /**
      * Indicates that validation by logic is not available and the solution must be used for validation
      */
    get validateWithSolution(): boolean;
}

export interface Position {
    readonly x: number;
    readonly y: number;
}
export interface Edge {
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
}
export enum State {
    Error = "error",
    Satisfied = "satisfied",
    Incomplete = "incomplete"
}
export type RuleState = {
    readonly state: State.Error;
    readonly positions: readonly Position[];
} | {
    readonly state: State.Satisfied;
} | {
    readonly state: State.Incomplete;
};
export interface GridState {
    final: State;
    rules: readonly RuleState[];
    symbols: ReadonlyMap<string, State[]>;
}
export enum Color {
    Dark = "dark",
    Light = "light",
    Gray = "gray"
}
export enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right"
}
export const DIRECTIONS: readonly Direction[];
export enum Mode {
    Create = "create",
    Solve = "solve"
}

export interface PuzzleMetadata {
    title: string;
    author: string;
    description: string;
    link: string;
    difficulty: number;
}
export const PuzzleSchema: z.ZodObject<{
    title: z.ZodString;
    author: z.ZodString;
    description: z.ZodString;
    link: z.ZodString;
    difficulty: z.ZodNumber;
    grid: z.ZodType<GridData, z.ZodTypeDef, GridData>;
    solution: z.ZodNullable<z.ZodType<GridData, z.ZodTypeDef, GridData>>;
}, "strip", z.ZodTypeAny, {
    grid: GridData;
    description: string;
    link: string;
    title: string;
    author: string;
    difficulty: number;
    solution: GridData | null;
}, {
    grid: GridData;
    description: string;
    link: string;
    title: string;
    author: string;
    difficulty: number;
    solution: GridData | null;
}>;
export interface Puzzle extends PuzzleMetadata {
    grid: GridData;
    solution: GridData | null;
}

export class BanPatternRule extends Rule {
    readonly pattern: GridData;
    constructor(pattern: GridData);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    get searchVariants(): SearchVariant[];
    validateGrid(grid: GridData): RuleState;
    copyWith({ pattern }: {
        pattern?: GridData;
    }): this;
    withPattern(pattern: GridData): this;
}

export class CompletePatternRule extends Rule {
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get searchVariants(): SearchVariant[];
    validateGrid(_grid: GridData): RuleState;
    copyWith(_: object): this;
    get validateWithSolution(): boolean;
}

export class ConnectAllRule extends Rule {
    readonly color: Color;
    constructor(color: Color);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    get searchVariants(): SearchVariant[];
    validateGrid(grid: GridData): RuleState;
    copyWith({ color }: {
        color?: Color;
    }): this;
    withColor(color: Color): this;
}

export class CustomRule extends Rule {
    readonly description: string;
    readonly grid: GridData;
    static readonly configs: readonly AnyConfig[];
    constructor(description: string, grid: GridData);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    get searchVariants(): SearchVariant[];
    validateGrid(_grid: GridData): RuleState;
    copyWith({ description, grid, }: {
        description?: string;
        grid?: GridData;
    }): this;
    get validateWithSolution(): boolean;
}

export class RegionAreaRule extends Rule {
    readonly color: Color;
    readonly size: number;
    constructor(color: Color, size: number);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    get searchVariants(): SearchVariant[];
    validateGrid(grid: GridData): RuleState;
    copyWith({ color, size }: {
        color?: Color;
        size?: number;
    }): this;
    withColor(color: Color): this;
    withSize(size: number): this;
}

export interface SearchVariant {
    description: string;
    rule: Rule;
}
export abstract class Rule extends Instruction {
    abstract validateGrid(grid: GridData): RuleState;
    statusText(_grid: GridData, _solution: GridData | null, _state: GridState): string | null;
    abstract get searchVariants(): SearchVariant[];
    searchVariant(): SearchVariant;
}

export class UndercluedRule extends Rule {
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get searchVariants(): SearchVariant[];
    validateGrid(_grid: GridData): RuleState;
    copyWith(_: object): this;
    get validateWithSolution(): boolean;
    statusText(grid: GridData, solution: GridData | null, _state: GridState): string | null;
}

const Serializer: {
    stringifyPuzzle(puzzle: Puzzle): string;
    parsePuzzle(input: string): Puzzle;
};
export Serializer;

class MasterCompressor extends CompressorBase {
    get id(): string;
    compress(input: string): Promise<string>;
    decompress(input: string): Promise<string>;
}
const Compressor: MasterCompressor;
export Compressor;

export abstract class CompressorBase {
    abstract get id(): string;
    abstract compress(input: string): Promise<string>;
    abstract decompress(input: string): Promise<string>;
}

export class DeflateCompressor extends StreamCompressor {
    get id(): string;
    protected get algorithm(): CompressionFormat;
    compress(input: string): Promise<string>;
    decompress(input: string): Promise<string>;
}

export class GzipCompressor extends StreamCompressor {
    get id(): string;
    protected get algorithm(): CompressionFormat;
}

export abstract class StreamCompressor extends CompressorBase {
    protected abstract get algorithm(): CompressionFormat;
    compress(input: string): Promise<string>;
    decompress(input: string): Promise<string>;
}

export class SerializerV0 extends SerializerBase {
    readonly version = 0;
    stringifyTile(tile: TileData): string;
    parseTile(str: string): TileData;
    stringifyConfig(instruction: Instruction, config: AnyConfig): string;
    parseConfig(configs: readonly AnyConfig[], entry: string): [string, unknown];
    stringifyInstruction(instruction: Instruction): string;
    stringifyRule(rule: Rule): string;
    stringifySymbol(symbol: Symbol): string;
    parseRule(str: string): Rule;
    parseSymbol(str: string): Symbol;
    stringifyConnections(connections: GridConnections): string;
    parseConnections(input: string): GridConnections;
    stringifyTiles(tiles: readonly (readonly TileData[])[]): string;
    parseTiles(input: string): TileData[][];
    stringifyRules(rules: readonly Rule[]): string;
    parseRules(input: string): Rule[];
    stringifySymbols(symbols: ReadonlyMap<string, readonly Symbol[]>): string;
    parseSymbols(input: string): Map<string, Symbol[]>;
    stringifyGrid(grid: GridData): string;
    parseGrid(input: string): GridData;
    stringifyPuzzle(puzzle: Puzzle): string;
    parsePuzzle(input: string): Puzzle;
}

export abstract class SerializerBase {
    abstract get version(): number;
    abstract stringifyTile(tile: TileData): string;
    abstract parseTile(str: string): TileData;
    abstract stringifyRule(rule: Rule): string;
    abstract stringifySymbol(symbol: Symbol): string;
    abstract parseRule(str: string): Rule;
    abstract parseSymbol(str: string): Symbol;
    abstract stringifyConnections(connections: GridConnections): string;
    abstract parseConnections(input: string): GridConnections;
    abstract stringifyTiles(tiles: readonly (readonly TileData[])[]): string;
    abstract parseTiles(input: string): TileData[][];
    abstract stringifyRules(rules: readonly Rule[]): string;
    abstract parseRules(input: string): Rule[];
    abstract stringifySymbols(symbols: ReadonlyMap<string, readonly Symbol[]>): string;
    abstract parseSymbols(input: string): Map<string, Symbol[]>;
    abstract stringifyGrid(grid: GridData): string;
    abstract parseGrid(input: string): GridData;
    abstract stringifyPuzzle(puzzle: Puzzle): string;
    abstract parsePuzzle(input: string): Puzzle;
}

export class LetterSymbol extends Symbol {
    readonly x: number;
    readonly y: number;
    readonly letter: string;
    constructor(x: number, y: number, letter: string);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    validateSymbol(grid: GridData): State;
    copyWith({ x, y, letter, }: {
        x?: number;
        y?: number;
        letter?: string;
    }): this;
    withLetter(letter: string): this;
}

export class NumberSymbol extends Symbol {
    readonly x: number;
    readonly y: number;
    readonly number: number;
    constructor(x: number, y: number, number: number);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    validateSymbol(grid: GridData): State;
    copyWith({ x, y, number, }: {
        x?: number;
        y?: number;
        number?: number;
    }): this;
    withNumber(number: number): this;
}

export class QuestionMarkSign extends Sign {
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    copyWith({ x, y }: {
        x?: number;
        y?: number;
    }): this;
}

/**
  * A sign is a symbol that is only used for illustrative purposes.
  * They should only appear in example grids of other instructions.
  */
export abstract class Sign extends Symbol {
    validateSymbol(_grid: GridData): State;
}

export abstract class Symbol extends Instruction {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    abstract validateSymbol(grid: GridData): State;
    withX(x: number): this;
    withY(y: number): this;
    withPosition(x: number, y: number): this;
}

export class ViewpointSymbol extends Symbol {
    readonly x: number;
    readonly y: number;
    readonly number: number;
    constructor(x: number, y: number, number: number);
    get id(): string;
    get explanation(): string;
    createExampleGrid(): GridData;
    get configs(): readonly AnyConfig[] | null;
    validateSymbol(grid: GridData): State;
    copyWith({ x, y, number, }: {
        x?: number;
        y?: number;
        number?: number;
    }): this;
    withNumber(number: number): this;
}

export class TileData {
    readonly exists: boolean;
    readonly fixed: boolean;
    readonly color: Color;
    constructor(exists: boolean, fixed: boolean, color: Color);
    static empty(): TileData;
    copyWith({ exists, fixed, color, }: {
        exists?: boolean;
        fixed?: boolean;
        color?: Color;
    }): this;
    withExists(exists: boolean): this;
    withFixed(fixed: boolean): this;
    withColor(color: Color): this;
    get isFixed(): boolean;
    static create(char: string): TileData;
}

export class TileConnections {
    [y: number]: {
        [x: number]: boolean;
    };
    constructor();
    get topLeft(): boolean;
    set topLeft(value: boolean);
    get top(): boolean;
    set top(value: boolean);
    get topRight(): boolean;
    set topRight(value: boolean);
    get left(): boolean;
    set left(value: boolean);
    get center(): boolean;
    set center(value: boolean);
    get right(): boolean;
    set right(value: boolean);
    get bottomLeft(): boolean;
    set bottomLeft(value: boolean);
    get bottom(): boolean;
    set bottom(value: boolean);
    get bottomRight(): boolean;
    set bottomRight(value: boolean);
}


}
export {};