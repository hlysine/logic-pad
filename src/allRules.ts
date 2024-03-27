import GridData from './data/grid';
import { Color } from './data/primitives';
import BanPatternRule from './data/rules/banPatternRule';
import CompletePatternRule from './data/rules/completePatternRule';
import ConnectAllRule from './data/rules/connectAllRule';
import CustomRule from './data/rules/customRule';
import Rule from './data/rules/rule';
import UndercluedRule from './data/rules/undercluedRule';

const allRules = new Map<string, Rule>();

function register<T extends Rule>(prototype: T) {
  allRules.set(prototype.id, prototype);
}

register(new BanPatternRule(GridData.create([])));
register(new CompletePatternRule());
register(new ConnectAllRule(Color.Dark));
register(new UndercluedRule());
register(new CustomRule('', GridData.create([])));

export default allRules;
