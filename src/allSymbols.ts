import AreaNumberSymbolData from './data/symbols/areaNumberSymbol';
import LetterSymbolData from './data/symbols/letterSymbol';
import ViewpointSymbolData from './data/symbols/viewpointSymbol';
import DartSymbolData from './data/symbols/dartSymbol';
import QuestionMarkSignData from './data/symbols/signs/questionMarkSign';
import SymbolData from './data/symbols/symbol';
import AreaNumberSymbolUI from './ui/symbols/AreaNumberSymbol';
import LetterSymbolUI from './ui/symbols/LetterSymbol';
import ViewpointSymbolUI from './ui/symbols/ViewpointSymbol';
import DartSymbolUI from './ui/symbols/DartSymbol';
import LotusSymbolUI from './ui/symbols/LotusSymbol';
import GalaxySymbolUI from './ui/symbols/GalaxySymbol';
import DirectionLinkerSymbolUI from './ui/symbols/DirectionLinkerSymbol';
import QuestionMarkSignUI from './ui/symbols/signs/QuestionMarkSign';
import { Direction, Orientation } from './data/primitives';
import LotusSymbol from './data/symbols/lotusSymbol';
import GalaxySymbol from './data/symbols/galaxySymbol';
import DirectionLinkerSymbol from './data/symbols/directionLinkerSymbol';

export interface SymbolProps<T extends SymbolData> {
  textClass: string;
  symbol: T;
}

interface SymbolInfo {
  readonly component: React.NamedExoticComponent<SymbolProps<SymbolData>>;
  readonly prototype: SymbolData;
}

const allSymbols = new Map<string, SymbolInfo>();

function register<T extends SymbolData>(
  prototype: T,
  component: React.NamedExoticComponent<SymbolProps<T>>
) {
  allSymbols.set(prototype.id, {
    component: component as React.NamedExoticComponent<SymbolProps<SymbolData>>,
    prototype,
  });
}

register(new AreaNumberSymbolData(0, 0, 1), AreaNumberSymbolUI);
register(new LetterSymbolData(0, 0, 'A'), LetterSymbolUI);
register(new ViewpointSymbolData(0, 0, 1), ViewpointSymbolUI);
register(new DartSymbolData(0, 0, 1, Direction.Down), DartSymbolUI);
register(new LotusSymbol(0, 0, Orientation.Up), LotusSymbolUI);
register(new GalaxySymbol(0, 0), GalaxySymbolUI);
register(new DirectionLinkerSymbol(0, 0), DirectionLinkerSymbolUI);
register(new QuestionMarkSignData(0, 0), QuestionMarkSignUI);

export default allSymbols;
