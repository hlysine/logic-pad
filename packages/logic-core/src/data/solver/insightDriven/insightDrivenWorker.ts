import { Serializer } from '../../serializer/allSerializers.js';
import GridData from '../../grid.js';
import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import validateGrid from '../../validate.js';
import { State } from '../../primitives.js';
import Instruction from '../../instruction.js';
import Rule from '../../rules/rule.js';
import { AreaNumberHasRightSize } from "./lemmas/AreaNumberHasRightSize.js";

export type Lemma = {
  isAppliable: (grid: GridData) => boolean; // Say if the lemma is appliable to the grid
  apply: (grid: GridData) => GridData; // Apply the lemma to the grid
  score: number; // How difficult the lemma is to manage
  requirements: {
    instruction: Instruction;
    presence: boolean;
  }[]; // The base requirements for the lemma to be appliable
};

const allLemmas: Lemma[] = [
  AreaNumberHasRightSize,
];

function getAvailableLemmas(grid: GridData): Lemma[] {
  return allLemmas.filter(lemma => {
    return lemma.requirements.every(req => {
      return !(req.instruction instanceof Rule
        ? grid.findRule(rule => rule.id === req.instruction.id)
        : grid.findSymbol(symbol => symbol.id === req.instruction.id)) !== req.presence;
    });
  });
}

function solveNormal(
  input: GridData,
  submitSolution: (grid: GridData | null) => boolean
) {
  let isValid = validateGrid(input, null);

  if (isValid.final === State.Error) {
    return;
  }

  const availableLemmas = getAvailableLemmas(input);

  while (isValid.final === State.Incomplete) {
    const appliableLemmas = availableLemmas.filter(lemma => {
      return lemma.isAppliable(input);
    });
    if (appliableLemmas.length === 0) {
      break; // No more lemmas to apply
    }
    const bestLemma = appliableLemmas.reduce((best, current) =>
      best.score < current.score ? best : current
    );
    input = bestLemma.apply(input);
    isValid = validateGrid(input, null);
  }
  submitSolution(isValid.final !== State.Error ? input : null);
}

function solve(
  grid: GridData,
  submitSolution: (grid: GridData | null) => boolean
) {
  if (grid.findRule(rule => rule.id === undercluedInstance.id)) {
    // Will not support underclued because of the way the solver works
    submitSolution(null);
  } else {
    solveNormal(grid, submitSolution);
  }
}

onmessage = e => {
  const grid = Serializer.parseGrid(e.data as string);

  let count = 0;

  solve(grid, solution => {
    if (solution) {
      if (solution.resetTiles().colorEquals(solution)) {
        solution = null;
      }
    }
    postMessage(solution ? Serializer.stringifyGrid(solution) : null);

    count += 1;
    return count < 2;
  });

  postMessage(null);
};

export {};
