import GridData from './data/grid';
import { Color } from './data/primitives';
import BanPatternRule from './data/rules/banPatternRule';
import CellCountRule from './data/rules/cellCountRule';
import CompletePatternRule from './data/rules/completePatternRule';
import ConnectAllRule from './data/rules/connectAllRule';
import CustomRule from './data/rules/customRule';
import OffByXRule from './data/rules/offByXRule';
import RegionAreaRule from './data/rules/regionAreaRule';
import Rule from './data/rules/rule';
import UndercluedRule from './data/rules/undercluedRule';
import SymbolsPerRegionRule from './data/rules/symbolsPerRegionRule';

const allRules = new Map<string, Rule>();

function register<T extends Rule>(prototype: T) {
  allRules.set(prototype.id, prototype);
}

register(new BanPatternRule(GridData.create([])));
register(new CompletePatternRule());
register(new ConnectAllRule(Color.Dark));
register(new RegionAreaRule(Color.Dark, 2));
register(new OffByXRule(1));
register(new CellCountRule(Color.Dark, 10));
register(new UndercluedRule());
register(new SymbolsPerRegionRule(Color.Dark, 1));
register(new CustomRule('', GridData.create([])));

export default allRules;
