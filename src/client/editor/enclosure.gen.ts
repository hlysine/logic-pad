/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

import { ConfigType, configEquals } from '../../../src/data/config';
import Configurable from '../../../src/data/configurable';
import { allEqual, array, directionToRotation, escape, maxBy, minBy, move, orientationToRotation, resize, unescape } from '../../../src/data/dataHelper';
import { isEventHandler } from '../../../src/data/events/eventHelper';
import { handlesFinalValidation } from '../../../src/data/events/onFinalValidation';
import { handlesGridChange } from '../../../src/data/events/onGridChange';
import { handlesGridResize } from '../../../src/data/events/onGridResize';
import { handlesSetGrid } from '../../../src/data/events/onSetGrid';
import { handlesSymbolValidation } from '../../../src/data/events/onSymbolValidation';
import GridData from '../../../src/data/grid';
import GridConnections from '../../../src/data/gridConnections';
import Instruction from '../../../src/data/instruction';
import { COMPARISONS, Color, Comparison, DIRECTIONS, Direction, Mode, ORIENTATIONS, Orientation, State, directionToggle, orientationToggle } from '../../../src/data/primitives';
import { MetadataSchema, PuzzleSchema } from '../../../src/data/puzzle';
import BanPatternRule from '../../../src/data/rules/banPatternRule';
import CellCountRule from '../../../src/data/rules/cellCountRule';
import CompletePatternRule from '../../../src/data/rules/completePatternRule';
import ConnectAllRule from '../../../src/data/rules/connectAllRule';
import CustomRule from '../../../src/data/rules/customRule';
import ForesightRule from '../../../src/data/rules/foresightRule';
import { allRules } from '../../../src/data/rules/index';
import { ControlLine, Row } from '../../../src/data/rules/musicControlLine';
import MusicGridRule from '../../../src/data/rules/musicGridRule';
import MysteryRule from '../../../src/data/rules/mysteryRule';
import OffByXRule from '../../../src/data/rules/offByXRule';
import RegionAreaRule from '../../../src/data/rules/regionAreaRule';
import RegionShapeRule from '../../../src/data/rules/regionShapeRule';
import Rule from '../../../src/data/rules/rule';
import SameShapeRule from '../../../src/data/rules/sameShapeRule';
import SymbolsPerRegionRule from '../../../src/data/rules/symbolsPerRegionRule';
import UndercluedRule from '../../../src/data/rules/undercluedRule';
import UniqueShapeRule from '../../../src/data/rules/uniqueShapeRule';
import { Serializer } from '../../../src/data/serializer/allSerializers';
import { Compressor } from '../../../src/data/serializer/compressor/allCompressors';
import CompressorBase from '../../../src/data/serializer/compressor/compressorBase';
import DeflateCompressor from '../../../src/data/serializer/compressor/deflateCompressor';
import GzipCompressor from '../../../src/data/serializer/compressor/gzipCompressor';
import StreamCompressor from '../../../src/data/serializer/compressor/streamCompressor';
import SerializerBase from '../../../src/data/serializer/serializerBase';
import SerializerV0 from '../../../src/data/serializer/serializer_v0';
import { getShapeVariants, normalizeShape, positionsToShape, shapeEquals, tilesToShape } from '../../../src/data/shapes';
import { allSolvers } from '../../../src/data/solver/allSolvers';
import BacktrackSolver from '../../../src/data/solver/backtrack/backtrackSolver';
import BTModule, { BTGridData, BTTile, IntArray2D, colorToBTTile, createOneTileResult, getOppositeColor } from '../../../src/data/solver/backtrack/data';
import BanPatternBTModule from '../../../src/data/solver/backtrack/rules/banPattern';
import CellCountBTModule from '../../../src/data/solver/backtrack/rules/cellCount';
import ConnectAllBTModule from '../../../src/data/solver/backtrack/rules/connectAll';
import RegionAreaBTModule from '../../../src/data/solver/backtrack/rules/regionArea';
import RegionShapeBTModule from '../../../src/data/solver/backtrack/rules/regionShape';
import SameShapeBTModule from '../../../src/data/solver/backtrack/rules/sameShape';
import SymbolsPerRegionBTModule from '../../../src/data/solver/backtrack/rules/symbolsPerRegion';
import UniqueShapeBTModule from '../../../src/data/solver/backtrack/rules/uniqueShape';
import AreaNumberBTModule from '../../../src/data/solver/backtrack/symbols/areaNumber';
import DartBTModule from '../../../src/data/solver/backtrack/symbols/dart';
import DirectionLinkerBTModule from '../../../src/data/solver/backtrack/symbols/directionLinker';
import GalaxyBTModule from '../../../src/data/solver/backtrack/symbols/galaxy';
import LetterBTModule from '../../../src/data/solver/backtrack/symbols/letter';
import LotusBTModule from '../../../src/data/solver/backtrack/symbols/lotus';
import MinesweeperBTModule from '../../../src/data/solver/backtrack/symbols/minesweeper';
import MyopiaBTModule from '../../../src/data/solver/backtrack/symbols/myopia';
import ViewpointBTModule from '../../../src/data/solver/backtrack/symbols/viewpoint';
import Solver from '../../../src/data/solver/solver';
import UndercluedSolver from '../../../src/data/solver/underclued/undercluedSolver';
import AreaNumberModule from '../../../src/data/solver/z3/modules/areaNumberModule';
import CellCountModule from '../../../src/data/solver/z3/modules/cellCountModule';
import ConnectAllModule from '../../../src/data/solver/z3/modules/connectAllModule';
import DartModule from '../../../src/data/solver/z3/modules/dartModule';
import { allZ3Modules } from '../../../src/data/solver/z3/modules/index';
import LetterModule from '../../../src/data/solver/z3/modules/letterModule';
import MyopiaModule from '../../../src/data/solver/z3/modules/myopiaModule';
import RegionAreaModule from '../../../src/data/solver/z3/modules/regionAreaModule';
import ViewpointModule from '../../../src/data/solver/z3/modules/viewpointModule';
import Z3Module from '../../../src/data/solver/z3/modules/z3Module';
import { convertDirection } from '../../../src/data/solver/z3/utils';
import Z3Solver from '../../../src/data/solver/z3/z3Solver';
import Z3SolverContext from '../../../src/data/solver/z3/z3SolverContext';
import AreaNumberSymbol from '../../../src/data/symbols/areaNumberSymbol';
import CustomIconSymbol from '../../../src/data/symbols/customIconSymbol';
import CustomSymbol from '../../../src/data/symbols/customSymbol';
import CustomTextSymbol from '../../../src/data/symbols/customTextSymbol';
import DartSymbol from '../../../src/data/symbols/dartSymbol';
import DirectionLinkerSymbol from '../../../src/data/symbols/directionLinkerSymbol';
import GalaxySymbol from '../../../src/data/symbols/galaxySymbol';
import { allSymbols } from '../../../src/data/symbols/index';
import LetterSymbol from '../../../src/data/symbols/letterSymbol';
import LotusSymbol from '../../../src/data/symbols/lotusSymbol';
import MinesweeperSymbol from '../../../src/data/symbols/minesweeperSymbol';
import MultiEntrySymbol from '../../../src/data/symbols/multiEntrySymbol';
import MyopiaSymbol from '../../../src/data/symbols/myopiaSymbol';
import NumberSymbol from '../../../src/data/symbols/numberSymbol';
import Symbol from '../../../src/data/symbols/symbol';
import ViewpointSymbol from '../../../src/data/symbols/viewpointSymbol';
import TileData from '../../../src/data/tile';
import TileConnections from '../../../src/data/tileConnections';
import validateGrid, { aggregateState, applyFinalOverrides } from '../../../src/data/validate';

export const enclosure: { name: string; value: unknown }[] = [
  { name: 'ConfigType', value: ConfigType },
  { name: 'configEquals', value: configEquals },
  { name: 'Configurable', value: Configurable },
  { name: 'allEqual', value: allEqual },
  { name: 'array', value: array },
  { name: 'directionToRotation', value: directionToRotation },
  { name: 'escape', value: escape },
  { name: 'maxBy', value: maxBy },
  { name: 'minBy', value: minBy },
  { name: 'move', value: move },
  { name: 'orientationToRotation', value: orientationToRotation },
  { name: 'resize', value: resize },
  { name: 'unescape', value: unescape },
  { name: 'isEventHandler', value: isEventHandler },
  { name: 'handlesFinalValidation', value: handlesFinalValidation },
  { name: 'handlesGridChange', value: handlesGridChange },
  { name: 'handlesGridResize', value: handlesGridResize },
  { name: 'handlesSetGrid', value: handlesSetGrid },
  { name: 'handlesSymbolValidation', value: handlesSymbolValidation },
  { name: 'GridData', value: GridData },
  { name: 'GridConnections', value: GridConnections },
  { name: 'Instruction', value: Instruction },
  { name: 'COMPARISONS', value: COMPARISONS },
  { name: 'Color', value: Color },
  { name: 'Comparison', value: Comparison },
  { name: 'DIRECTIONS', value: DIRECTIONS },
  { name: 'Direction', value: Direction },
  { name: 'Mode', value: Mode },
  { name: 'ORIENTATIONS', value: ORIENTATIONS },
  { name: 'Orientation', value: Orientation },
  { name: 'State', value: State },
  { name: 'directionToggle', value: directionToggle },
  { name: 'orientationToggle', value: orientationToggle },
  { name: 'MetadataSchema', value: MetadataSchema },
  { name: 'PuzzleSchema', value: PuzzleSchema },
  { name: 'BanPatternRule', value: BanPatternRule },
  { name: 'CellCountRule', value: CellCountRule },
  { name: 'CompletePatternRule', value: CompletePatternRule },
  { name: 'ConnectAllRule', value: ConnectAllRule },
  { name: 'CustomRule', value: CustomRule },
  { name: 'ForesightRule', value: ForesightRule },
  { name: 'allRules', value: allRules },
  { name: 'ControlLine', value: ControlLine },
  { name: 'Row', value: Row },
  { name: 'MusicGridRule', value: MusicGridRule },
  { name: 'MysteryRule', value: MysteryRule },
  { name: 'OffByXRule', value: OffByXRule },
  { name: 'RegionAreaRule', value: RegionAreaRule },
  { name: 'RegionShapeRule', value: RegionShapeRule },
  { name: 'Rule', value: Rule },
  { name: 'SameShapeRule', value: SameShapeRule },
  { name: 'SymbolsPerRegionRule', value: SymbolsPerRegionRule },
  { name: 'UndercluedRule', value: UndercluedRule },
  { name: 'UniqueShapeRule', value: UniqueShapeRule },
  { name: 'Serializer', value: Serializer },
  { name: 'Compressor', value: Compressor },
  { name: 'CompressorBase', value: CompressorBase },
  { name: 'DeflateCompressor', value: DeflateCompressor },
  { name: 'GzipCompressor', value: GzipCompressor },
  { name: 'StreamCompressor', value: StreamCompressor },
  { name: 'SerializerBase', value: SerializerBase },
  { name: 'SerializerV0', value: SerializerV0 },
  { name: 'getShapeVariants', value: getShapeVariants },
  { name: 'normalizeShape', value: normalizeShape },
  { name: 'positionsToShape', value: positionsToShape },
  { name: 'shapeEquals', value: shapeEquals },
  { name: 'tilesToShape', value: tilesToShape },
  { name: 'allSolvers', value: allSolvers },
  { name: 'BacktrackSolver', value: BacktrackSolver },
  { name: 'BTModule', value: BTModule },
  { name: 'BTGridData', value: BTGridData },
  { name: 'BTTile', value: BTTile },
  { name: 'IntArray2D', value: IntArray2D },
  { name: 'colorToBTTile', value: colorToBTTile },
  { name: 'createOneTileResult', value: createOneTileResult },
  { name: 'getOppositeColor', value: getOppositeColor },
  { name: 'BanPatternBTModule', value: BanPatternBTModule },
  { name: 'CellCountBTModule', value: CellCountBTModule },
  { name: 'ConnectAllBTModule', value: ConnectAllBTModule },
  { name: 'RegionAreaBTModule', value: RegionAreaBTModule },
  { name: 'RegionShapeBTModule', value: RegionShapeBTModule },
  { name: 'SameShapeBTModule', value: SameShapeBTModule },
  { name: 'SymbolsPerRegionBTModule', value: SymbolsPerRegionBTModule },
  { name: 'UniqueShapeBTModule', value: UniqueShapeBTModule },
  { name: 'AreaNumberBTModule', value: AreaNumberBTModule },
  { name: 'DartBTModule', value: DartBTModule },
  { name: 'DirectionLinkerBTModule', value: DirectionLinkerBTModule },
  { name: 'GalaxyBTModule', value: GalaxyBTModule },
  { name: 'LetterBTModule', value: LetterBTModule },
  { name: 'LotusBTModule', value: LotusBTModule },
  { name: 'MinesweeperBTModule', value: MinesweeperBTModule },
  { name: 'MyopiaBTModule', value: MyopiaBTModule },
  { name: 'ViewpointBTModule', value: ViewpointBTModule },
  { name: 'Solver', value: Solver },
  { name: 'UndercluedSolver', value: UndercluedSolver },
  { name: 'AreaNumberModule', value: AreaNumberModule },
  { name: 'CellCountModule', value: CellCountModule },
  { name: 'ConnectAllModule', value: ConnectAllModule },
  { name: 'DartModule', value: DartModule },
  { name: 'allZ3Modules', value: allZ3Modules },
  { name: 'LetterModule', value: LetterModule },
  { name: 'MyopiaModule', value: MyopiaModule },
  { name: 'RegionAreaModule', value: RegionAreaModule },
  { name: 'ViewpointModule', value: ViewpointModule },
  { name: 'Z3Module', value: Z3Module },
  { name: 'convertDirection', value: convertDirection },
  { name: 'Z3Solver', value: Z3Solver },
  { name: 'Z3SolverContext', value: Z3SolverContext },
  { name: 'AreaNumberSymbol', value: AreaNumberSymbol },
  { name: 'CustomIconSymbol', value: CustomIconSymbol },
  { name: 'CustomSymbol', value: CustomSymbol },
  { name: 'CustomTextSymbol', value: CustomTextSymbol },
  { name: 'DartSymbol', value: DartSymbol },
  { name: 'DirectionLinkerSymbol', value: DirectionLinkerSymbol },
  { name: 'GalaxySymbol', value: GalaxySymbol },
  { name: 'allSymbols', value: allSymbols },
  { name: 'LetterSymbol', value: LetterSymbol },
  { name: 'LotusSymbol', value: LotusSymbol },
  { name: 'MinesweeperSymbol', value: MinesweeperSymbol },
  { name: 'MultiEntrySymbol', value: MultiEntrySymbol },
  { name: 'MyopiaSymbol', value: MyopiaSymbol },
  { name: 'NumberSymbol', value: NumberSymbol },
  { name: 'Symbol', value: Symbol },
  { name: 'ViewpointSymbol', value: ViewpointSymbol },
  { name: 'TileData', value: TileData },
  { name: 'TileConnections', value: TileConnections },
  { name: 'validateGrid', value: validateGrid },
  { name: 'aggregateState', value: aggregateState },
  { name: 'applyFinalOverrides', value: applyFinalOverrides },
];
