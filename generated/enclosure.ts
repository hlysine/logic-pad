import { ConfigType, configEquals } from '../src/data/config';
import GridData from '../src/data/grid';
import GridConnections from '../src/data/gridConnections';
import {
  array,
  escape,
  maxBy,
  minBy,
  move,
  unescape,
} from '../src/data/helper';
import Instruction from '../src/data/instruction';
import {
  Color,
  DIRECTIONS,
  Direction,
  Mode,
  ORIENTATIONS,
  Orientation,
  State,
} from '../src/data/primitives';
import { PuzzleSchema } from '../src/data/puzzle';
import TileData from '../src/data/tile';
import TileConnections from '../src/data/tileConnections';
import validateGrid, { aggregateState } from '../src/data/validate';
import AreaNumberSymbol from '../src/data/symbols/areaNumberSymbol';
import CustomIconSymbol from '../src/data/symbols/customIconSymbol';
import CustomSymbol from '../src/data/symbols/customSymbol';
import CustomTextSymbol from '../src/data/symbols/customTextSymbol';
import DartSymbol from '../src/data/symbols/dartSymbol';
import DirectionLinkerSymbol from '../src/data/symbols/directionLinkerSymbol';
import GalaxySymbol from '../src/data/symbols/galaxySymbol';
import { allSymbols } from '../src/data/symbols/index';
import LetterSymbol from '../src/data/symbols/letterSymbol';
import LotusSymbol from '../src/data/symbols/lotusSymbol';
import MultiEntrySymbol from '../src/data/symbols/multiEntrySymbol';
import NumberSymbol from '../src/data/symbols/numberSymbol';
import Symbol from '../src/data/symbols/symbol';
import ViewpointSymbol from '../src/data/symbols/viewpointSymbol';
import QuestionMarkSign from '../src/data/symbols/signs/questionMarkSign';
import Sign from '../src/data/symbols/signs/sign';
import { Serializer } from '../src/data/serializer/allSerializers';
import SerializerBase from '../src/data/serializer/serializerBase';
import SerializerV0 from '../src/data/serializer/serializer_v0';
import { Compressor } from '../src/data/serializer/compressor/allCompressors';
import CompressorBase from '../src/data/serializer/compressor/compressorBase';
import DeflateCompressor from '../src/data/serializer/compressor/deflateCompressor';
import GzipCompressor from '../src/data/serializer/compressor/gzipCompressor';
import StreamCompressor from '../src/data/serializer/compressor/streamCompressor';
import BanPatternRule from '../src/data/rules/banPatternRule';
import CellCountRule from '../src/data/rules/cellCountRule';
import CompletePatternRule from '../src/data/rules/completePatternRule';
import ConnectAllRule from '../src/data/rules/connectAllRule';
import CustomRule from '../src/data/rules/customRule';
import { allRules } from '../src/data/rules/index';
import OffByXRule from '../src/data/rules/offByXRule';
import RegionAreaRule from '../src/data/rules/regionAreaRule';
import Rule from '../src/data/rules/rule';
import SymbolsPerRegionRule from '../src/data/rules/symbolsPerRegionRule';
import UndercluedRule from '../src/data/rules/undercluedRule';

const enclosure: { name: string; value: unknown }[] = [
  { name: 'ConfigType', value: ConfigType },
  { name: 'configEquals', value: configEquals },
  { name: 'GridData', value: GridData },
  { name: 'GridConnections', value: GridConnections },
  { name: 'array', value: array },
  { name: 'escape', value: escape },
  { name: 'maxBy', value: maxBy },
  { name: 'minBy', value: minBy },
  { name: 'move', value: move },
  { name: 'unescape', value: unescape },
  { name: 'Instruction', value: Instruction },
  { name: 'Color', value: Color },
  { name: 'DIRECTIONS', value: DIRECTIONS },
  { name: 'Direction', value: Direction },
  { name: 'Mode', value: Mode },
  { name: 'ORIENTATIONS', value: ORIENTATIONS },
  { name: 'Orientation', value: Orientation },
  { name: 'State', value: State },
  { name: 'PuzzleSchema', value: PuzzleSchema },
  { name: 'TileData', value: TileData },
  { name: 'TileConnections', value: TileConnections },
  { name: 'validateGrid', value: validateGrid },
  { name: 'aggregateState', value: aggregateState },
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
  { name: 'MultiEntrySymbol', value: MultiEntrySymbol },
  { name: 'NumberSymbol', value: NumberSymbol },
  { name: 'Symbol', value: Symbol },
  { name: 'ViewpointSymbol', value: ViewpointSymbol },
  { name: 'QuestionMarkSign', value: QuestionMarkSign },
  { name: 'Sign', value: Sign },
  { name: 'Serializer', value: Serializer },
  { name: 'SerializerBase', value: SerializerBase },
  { name: 'SerializerV0', value: SerializerV0 },
  { name: 'Compressor', value: Compressor },
  { name: 'CompressorBase', value: CompressorBase },
  { name: 'DeflateCompressor', value: DeflateCompressor },
  { name: 'GzipCompressor', value: GzipCompressor },
  { name: 'StreamCompressor', value: StreamCompressor },
  { name: 'BanPatternRule', value: BanPatternRule },
  { name: 'CellCountRule', value: CellCountRule },
  { name: 'CompletePatternRule', value: CompletePatternRule },
  { name: 'ConnectAllRule', value: ConnectAllRule },
  { name: 'CustomRule', value: CustomRule },
  { name: 'allRules', value: allRules },
  { name: 'OffByXRule', value: OffByXRule },
  { name: 'RegionAreaRule', value: RegionAreaRule },
  { name: 'Rule', value: Rule },
  { name: 'SymbolsPerRegionRule', value: SymbolsPerRegionRule },
  { name: 'UndercluedRule', value: UndercluedRule },
];

export { enclosure };
