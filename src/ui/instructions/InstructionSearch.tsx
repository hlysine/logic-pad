import { memo, useMemo, useState } from 'react';
import allRules from '../../data/rules';
import fuzzysort from 'fuzzysort';
import { cn } from '../../utils';
import AnnotatedText from './AnnotatedText';
import { useGrid } from '../GridContext';
import Rule from '../../data/rules/rule';

const ruleList = [...allRules.values()].flatMap(rule => rule.searchVariants);

// million-ignore
export default memo(function InstructionSearch() {
  const { grid, setGrid } = useGrid();
  const [search, setSearch] = useState('');

  const results = useMemo(
    () => fuzzysort.go(search, ruleList, { limit: 10, key: 'description' }),
    [search]
  );

  const addRule = (rule: Rule) => {
    setSearch('');
    setGrid(grid.addRule(rule.copyWith({})));
  };

  return (
    <div className="pr-2 shrink-0 mt-4">
      <div className="dropdown dropdown-end w-full">
        <input
          type="text"
          tabIndex={0}
          placeholder="Add a new rule..."
          className="input w-full max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addRule(results[0].obj.rule);
            } else if (e.key === 'Escape') {
              setSearch('');
            }
          }}
        />
        <ul
          tabIndex={0}
          className={cn(
            'dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-full m-0',
            results.length === 0 && 'hidden'
          )}
        >
          {results.map(result => (
            <li key={result.obj.description}>
              <a onClick={() => addRule(result.obj.rule)}>
                <AnnotatedText text={result.obj.description} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
