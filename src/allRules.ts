import BanPatternRule from './data/rules/banPatternRule';
import CompletePatternRule from './data/rules/completePatternRule';
import ConnectAllRule from './data/rules/connectAllRule';
import CustomRule from './data/rules/customRule';
import Rule, { SearchVariant } from './data/rules/rule';
import UndercluedRule from './data/rules/undercluedRule';

interface RuleInfo {
  readonly id: string;
  readonly searchVariants: SearchVariant[];
}

type RuleConstructor<T extends Rule> = (new (...args: never[]) => T) & RuleInfo;

const allRules = new Map<string, RuleInfo>();

function register<T extends Rule>(constructor: RuleConstructor<T>) {
  allRules.set(constructor.id, {
    id: constructor.id,
    searchVariants: constructor.searchVariants,
  });
}

register(BanPatternRule);
register(CompletePatternRule);
register(ConnectAllRule);
register(UndercluedRule);
register(CustomRule);

export default allRules;
