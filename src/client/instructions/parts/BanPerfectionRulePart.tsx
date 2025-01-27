import { useEffect } from 'react';
import { useGrid } from '../../contexts/GridContext';
import { instance as perfectionInstance } from '@logic-pad/core/data/rules/perfectionRule';

export default function BanPerfectionRulePart() {
  const { grid, solution, setGridRaw } = useGrid();

  useEffect(() => {
    if (grid.findRule(r => r.id === perfectionInstance.id)) {
      setGridRaw(
        grid.withRules(rules =>
          rules.filter(r => r.id !== perfectionInstance.id)
        ),
        solution?.withRules(rules =>
          rules.filter(r => r.id !== perfectionInstance.id)
        )
      );
    }
  }, [grid, solution, setGridRaw]);
  return null;
}
