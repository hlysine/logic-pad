import GridData from '../../grid.js';
import Instruction from '../../instruction.js';
import Rule from '../../rules/rule.js';

export type RequirementFunction = (grid: GridData) => boolean;

export type ApplyFunction = (grid: GridData) => [boolean, GridData];

export class Lemma {
  id: string;
  apply: ApplyFunction;
  score: number;
  requirements: RequirementFunction;

  constructor(
    id: string,
    apply: ApplyFunction,
    score: number,
    requirements: RequirementFunction
  ) {
    this.id = id;
    this.apply = apply;
    this.score = score;
    this.requirements = requirements;
  }
}

export function makeBasicRequirementFunction(
  reqList: {
    instruction: Instruction;
    presence: boolean;
  }[]
): RequirementFunction {
  return (grid: GridData) => {
    return reqList.every(req => {
      return (
        !(req.instruction instanceof Rule
          ? grid.findRule(rule => rule.id === req.instruction.id)
          : grid.findSymbol(symbol => symbol.id === req.instruction.id)) !==
        req.presence
      );
    });
  };
}
