/* prettier-ignore-start */

/* eslint-disable */

// noinspection JSUnusedGlobalSymbols

import { ConfigType, configEquals } from './data/config.js';
import Configurable from './data/configurable.js';
import { CachedAccess, allEqual, array, directionToRotation, escape, isSameEdge, maxBy, minBy, move, orientationToRotation, resize, unescape } from './data/dataHelper.js';
import { isEventHandler } from './data/events/eventHelper.js';
import { handlesFinalValidation } from './data/events/onFinalValidation.js';
import { handlesGetTile } from './data/events/onGetTile.js';
import { handlesGridChange } from './data/events/onGridChange.js';
import { handlesGridResize } from './data/events/onGridResize.js';
import { handlesSetGrid, invokeSetGrid } from './data/events/onSetGrid.js';
import { handlesSymbolDisplay } from './data/events/onSymbolDisplay.js';
import { handlesSymbolValidation } from './data/events/onSymbolValidation.js';
import GridData, { NEIGHBOR_OFFSETS } from './data/grid.js';
import GridConnections from './data/gridConnections.js';
import GridZones from './data/gridZones.js';
import Instruction from './data/instruction.js';
import { COMPARISONS, Color, Comparison, DIRECTIONS, Direction, MajorRule, Mode, ORIENTATIONS, Orientation, State, WRAPPINGS, Wrapping, directionToggle, orientationToggle } from './data/primitives.js';
import { MetadataSchema, PuzzleSchema } from './data/puzzle.js';
import BanPatternRule from './data/rules/banPatternRule.js';
import CellCountPerZoneRule from './data/rules/cellCountPerZoneRule.js';
import CellCountRule from './data/rules/cellCountRule.js';
import CompletePatternRule from './data/rules/completePatternRule.js';
import ConnectAllRule from './data/rules/connectAllRule.js';
import ContainsShapeRule from './data/rules/containsShapeRule.js';
import CustomRule from './data/rules/customRule.js';
import ForesightRule from './data/rules/foresightRule.js';
import { allRules } from './data/rules/index.js';
import LyingSymbolRule from './data/rules/lyingSymbolRule.js';
import { ControlLine, Row } from './data/rules/musicControlLine.js';
import MusicGridRule from './data/rules/musicGridRule.js';
import MysteryRule from './data/rules/mysteryRule.js';
import OffByXRule from './data/rules/offByXRule.js';
import PerfectionRule from './data/rules/perfectionRule.js';
import RegionAreaRule from './data/rules/regionAreaRule.js';
import RegionShapeRule from './data/rules/regionShapeRule.js';
import Rule from './data/rules/rule.js';
import SameShapeRule from './data/rules/sameShapeRule.js';
import SymbolsPerRegionRule from './data/rules/symbolsPerRegionRule.js';
import UndercluedRule from './data/rules/undercluedRule.js';
import UniqueShapeRule from './data/rules/uniqueShapeRule.js';
import WrapAroundRule from './data/rules/wrapAroundRule.js';
import { Serializer } from './data/serializer/allSerializers.js';
import { Compressor } from './data/serializer/compressor/allCompressors.js';
import CompressorBase from './data/serializer/compressor/compressorBase.js';
import DeflateCompressor from './data/serializer/compressor/deflateCompressor.js';
import GzipCompressor from './data/serializer/compressor/gzipCompressor.js';
import StreamCompressor from './data/serializer/compressor/streamCompressor.js';
import SerializerBase from './data/serializer/serializerBase.js';
import SerializerV0 from './data/serializer/serializer_v0.js';
import { getShapeVariants, normalizeShape, positionsToShape, sanitizePatternGrid, shapeEquals, tilesToShape } from './data/shapes.js';
import { allSolvers } from './data/solver/allSolvers.js';
import AutoSolver from './data/solver/auto/autoSolver.js';
import BacktrackSolver from './data/solver/backtrack/backtrackSolver.js';
import BTModule, { BTGridData, BTTile, IntArray2D, colorToBTTile, createOneTileResult, getOppositeColor } from './data/solver/backtrack/data.js';
import BanPatternBTModule from './data/solver/backtrack/rules/banPattern.js';
import CellCountBTModule from './data/solver/backtrack/rules/cellCount.js';
import ConnectAllBTModule from './data/solver/backtrack/rules/connectAll.js';
import RegionAreaBTModule from './data/solver/backtrack/rules/regionArea.js';
import RegionShapeBTModule from './data/solver/backtrack/rules/regionShape.js';
import SameShapeBTModule from './data/solver/backtrack/rules/sameShape.js';
import SymbolsPerRegionBTModule from './data/solver/backtrack/rules/symbolsPerRegion.js';
import UniqueShapeBTModule from './data/solver/backtrack/rules/uniqueShape.js';
import AreaNumberBTModule from './data/solver/backtrack/symbols/areaNumber.js';
import DartBTModule from './data/solver/backtrack/symbols/dart.js';
import DirectionLinkerBTModule from './data/solver/backtrack/symbols/directionLinker.js';
import FocusBTModule from './data/solver/backtrack/symbols/focus.js';
import GalaxyBTModule from './data/solver/backtrack/symbols/galaxy.js';
import LetterBTModule from './data/solver/backtrack/symbols/letter.js';
import LotusBTModule from './data/solver/backtrack/symbols/lotus.js';
import MinesweeperBTModule from './data/solver/backtrack/symbols/minesweeper.js';
import MyopiaBTModule from './data/solver/backtrack/symbols/myopia.js';
import ViewpointBTModule from './data/solver/backtrack/symbols/viewpoint.js';
import CspuzSolver from './data/solver/cspuz/cspuzSolver.js';
import { gridToJson } from './data/solver/cspuz/jsonify.js';
import EventIteratingSolver from './data/solver/eventIteratingSolver.js';
import Solver from './data/solver/solver.js';
import UniversalSolver from './data/solver/universal/universalSolver.js';
import AreaNumberModule from './data/solver/z3/modules/areaNumberModule.js';
import CellCountModule from './data/solver/z3/modules/cellCountModule.js';
import ConnectAllModule from './data/solver/z3/modules/connectAllModule.js';
import DartModule from './data/solver/z3/modules/dartModule.js';
import { allZ3Modules } from './data/solver/z3/modules/index.js';
import LetterModule from './data/solver/z3/modules/letterModule.js';
import MyopiaModule from './data/solver/z3/modules/myopiaModule.js';
import RegionAreaModule from './data/solver/z3/modules/regionAreaModule.js';
import ViewpointModule from './data/solver/z3/modules/viewpointModule.js';
import Z3Module from './data/solver/z3/modules/z3Module.js';
import { convertDirection } from './data/solver/z3/utils.js';
import Z3Solver from './data/solver/z3/z3Solver.js';
import Z3SolverContext from './data/solver/z3/z3SolverContext.js';
import AreaNumberSymbol from './data/symbols/areaNumberSymbol.js';
import CustomIconSymbol from './data/symbols/customIconSymbol.js';
import CustomSymbol from './data/symbols/customSymbol.js';
import CustomTextSymbol from './data/symbols/customTextSymbol.js';
import DartSymbol from './data/symbols/dartSymbol.js';
import DirectionLinkerSymbol from './data/symbols/directionLinkerSymbol.js';
import FocusSymbol from './data/symbols/focusSymbol.js';
import GalaxySymbol from './data/symbols/galaxySymbol.js';
import HiddenSymbol from './data/symbols/hiddenSymbol.js';
import { allSymbols } from './data/symbols/index.js';
import LetterSymbol from './data/symbols/letterSymbol.js';
import LotusSymbol from './data/symbols/lotusSymbol.js';
import MinesweeperSymbol from './data/symbols/minesweeperSymbol.js';
import MultiEntrySymbol from './data/symbols/multiEntrySymbol.js';
import MyopiaSymbol from './data/symbols/myopiaSymbol.js';
import NumberSymbol from './data/symbols/numberSymbol.js';
import Symbol from './data/symbols/symbol.js';
import ViewpointSymbol from './data/symbols/viewpointSymbol.js';
import TileData from './data/tile.js';
import TileConnections from './data/tileConnections.js';
import validateGrid, { aggregateState, applyFinalOverrides } from './data/validate.js';

export {
  ConfigType,
  configEquals,
  Configurable,
  CachedAccess,
  allEqual,
  array,
  directionToRotation,
  escape,
  isSameEdge,
  maxBy,
  minBy,
  move,
  orientationToRotation,
  resize,
  unescape,
  isEventHandler,
  handlesFinalValidation,
  handlesGetTile,
  handlesGridChange,
  handlesGridResize,
  handlesSetGrid,
  invokeSetGrid,
  handlesSymbolDisplay,
  handlesSymbolValidation,
  GridData,
  NEIGHBOR_OFFSETS,
  GridConnections,
  GridZones,
  Instruction,
  COMPARISONS,
  Color,
  Comparison,
  DIRECTIONS,
  Direction,
  MajorRule,
  Mode,
  ORIENTATIONS,
  Orientation,
  State,
  WRAPPINGS,
  Wrapping,
  directionToggle,
  orientationToggle,
  MetadataSchema,
  PuzzleSchema,
  BanPatternRule,
  CellCountPerZoneRule,
  CellCountRule,
  CompletePatternRule,
  ConnectAllRule,
  ContainsShapeRule,
  CustomRule,
  ForesightRule,
  allRules,
  LyingSymbolRule,
  ControlLine,
  Row,
  MusicGridRule,
  MysteryRule,
  OffByXRule,
  PerfectionRule,
  RegionAreaRule,
  RegionShapeRule,
  Rule,
  SameShapeRule,
  SymbolsPerRegionRule,
  UndercluedRule,
  UniqueShapeRule,
  WrapAroundRule,
  Serializer,
  Compressor,
  CompressorBase,
  DeflateCompressor,
  GzipCompressor,
  StreamCompressor,
  SerializerBase,
  SerializerV0,
  getShapeVariants,
  normalizeShape,
  positionsToShape,
  sanitizePatternGrid,
  shapeEquals,
  tilesToShape,
  allSolvers,
  AutoSolver,
  BacktrackSolver,
  BTModule,
  BTGridData,
  BTTile,
  IntArray2D,
  colorToBTTile,
  createOneTileResult,
  getOppositeColor,
  BanPatternBTModule,
  CellCountBTModule,
  ConnectAllBTModule,
  RegionAreaBTModule,
  RegionShapeBTModule,
  SameShapeBTModule,
  SymbolsPerRegionBTModule,
  UniqueShapeBTModule,
  AreaNumberBTModule,
  DartBTModule,
  DirectionLinkerBTModule,
  FocusBTModule,
  GalaxyBTModule,
  LetterBTModule,
  LotusBTModule,
  MinesweeperBTModule,
  MyopiaBTModule,
  ViewpointBTModule,
  CspuzSolver,
  gridToJson,
  EventIteratingSolver,
  Solver,
  UniversalSolver,
  AreaNumberModule,
  CellCountModule,
  ConnectAllModule,
  DartModule,
  allZ3Modules,
  LetterModule,
  MyopiaModule,
  RegionAreaModule,
  ViewpointModule,
  Z3Module,
  convertDirection,
  Z3Solver,
  Z3SolverContext,
  AreaNumberSymbol,
  CustomIconSymbol,
  CustomSymbol,
  CustomTextSymbol,
  DartSymbol,
  DirectionLinkerSymbol,
  FocusSymbol,
  GalaxySymbol,
  HiddenSymbol,
  allSymbols,
  LetterSymbol,
  LotusSymbol,
  MinesweeperSymbol,
  MultiEntrySymbol,
  MyopiaSymbol,
  NumberSymbol,
  Symbol,
  ViewpointSymbol,
  TileData,
  TileConnections,
  validateGrid,
  aggregateState,
  applyFinalOverrides,
};
