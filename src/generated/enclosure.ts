import { ConfigType, configEquals } from '../data/config';
import GridData from '../data/grid';
import GridConnections from '../data/gridConnections';
import { array, escape, maxBy, minBy, move, unescape } from '../data/helper';
import Instruction from '../data/instruction';
import {
  Color,
  DIRECTIONS,
  Direction,
  Mode,
  ORIENTATIONS,
  Orientation,
  State,
} from '../data/primitives';
import { PuzzleSchema } from '../data/puzzle';
import TileData from '../data/tile';
import TileConnections from '../data/tileConnections';
import validateGrid, { aggregateState } from '../data/validate';
import AreaNumberSymbol from '../data/symbols/areaNumberSymbol';
import CustomIconSymbol from '../data/symbols/customIconSymbol';
import CustomSymbol from '../data/symbols/customSymbol';
import CustomTextSymbol from '../data/symbols/customTextSymbol';
import DartSymbol from '../data/symbols/dartSymbol';
import DirectionLinkerSymbol from '../data/symbols/directionLinkerSymbol';
import GalaxySymbol from '../data/symbols/galaxySymbol';
import { allSymbols } from '../data/symbols/index';
import LetterSymbol from '../data/symbols/letterSymbol';
import LotusSymbol from '../data/symbols/lotusSymbol';
import MultiEntrySymbol from '../data/symbols/multiEntrySymbol';
import NumberSymbol from '../data/symbols/numberSymbol';
import Symbol from '../data/symbols/symbol';
import ViewpointSymbol from '../data/symbols/viewpointSymbol';
import QuestionMarkSign from '../data/symbols/signs/questionMarkSign';
import Sign from '../data/symbols/signs/sign';
import { Serializer } from '../data/serializer/allSerializers';
import SerializerBase from '../data/serializer/serializerBase';
import SerializerV0 from '../data/serializer/serializer_v0';
import { Compressor } from '../data/serializer/compressor/allCompressors';
import CompressorBase from '../data/serializer/compressor/compressorBase';
import DeflateCompressor from '../data/serializer/compressor/deflateCompressor';
import GzipCompressor from '../data/serializer/compressor/gzipCompressor';
import StreamCompressor from '../data/serializer/compressor/streamCompressor';
import BanPatternRule from '../data/rules/banPatternRule';
import CellCountRule from '../data/rules/cellCountRule';
import CompletePatternRule from '../data/rules/completePatternRule';
import ConnectAllRule from '../data/rules/connectAllRule';
import CustomRule from '../data/rules/customRule';
import { allRules } from '../data/rules/index';
import OffByXRule from '../data/rules/offByXRule';
import RegionAreaRule from '../data/rules/regionAreaRule';
import Rule from '../data/rules/rule';
import SymbolsPerRegionRule from '../data/rules/symbolsPerRegionRule';
import UndercluedRule from '../data/rules/undercluedRule';

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
