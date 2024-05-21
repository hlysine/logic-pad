import { memo, useState } from 'react';
import { allRules } from '../../data/rules';
import { useGrid } from '../contexts/GridContext.tsx';
import Rule from '../../data/rules/rule';
import Autocomplete from '../components/Autocomplete';

const ruleList = [...allRules.values()].flatMap(rule => rule.searchVariants);
const descriptionList = ruleList.map(x => x.description);

// million-ignore
export default memo(function InstructionSearch() {
  const { grid, setGrid } = useGrid();
  const [search, setSearch] = useState('');

  const addRule = (rule: Rule) => {
    setSearch('');
    setGrid(grid.addRule(rule.copyWith({})));
  };

  return (
    <Autocomplete
      className="pr-2 shrink-0 mt-4"
      placeholder="Add a new rule..."
      items={descriptionList}
      value={search}
      all={true}
      onChange={setSearch}
      onConfirm={val =>
        addRule(ruleList.find(x => x.description === val)!.rule)
      }
    />
  );
});
