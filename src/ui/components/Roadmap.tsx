import { memo } from 'react';
import { cn } from '../../utils';

type RoadmapItem = string | [string, ...RoadmapItem[]];

const roadmap: RoadmapItem[] = [
  '~Implement puzzle grid',
  '~Implement click and drag mouse input',
  '~Implement merged tiles',
  '~Implement rules UI',
  '~Implement color themes',
  [
    'Add rules and symbols',
    '~Area number',
    '~Letter',
    "~Don't make this pattern",
    '~Complete the pattern',
    '~Connect all ___ cells',
    '~Underclued grid',
    '~Viewpoint number',
    '~Dart number',
    '~Lotus',
    '~Galaxy',
    '~All ___ regions have area #',
    '~Exactly # symbols per ___ region',
    '~All numbers are off by #',
    '~There are # ___ cells in total',
    '~Myopia',
    '~Custom rule',
    '~Custom symbol',
    'Mystery puzzle: violate the rules (Hidden)',
    'Prefilled tiles',
    '# prefilled tiles are wrong',
    'Music Grid (as a grid rule)',
  ],
  [
    'Refactors',
    '~Discover rules and symbols with glob import',
    '~Separate data and UI repositories',
    '~Discover code editor enclosure with glob import',
    'Validate grid with web worker',
    'Use event system for rules and symbols',
  ],
  '~Add win confirmation',
  '~Add undo and restart',
  '~Add flood painting',
  '~Add tile counting by holding Ctrl',
  'Isolate grids between solve and create modes',
  '~Support mobile input',
  'Implement symbol stacking',
  '~Use custom theme system',
  '~Implement puzzle serialization',
  '~Enable PWA',
  [
    '~Optimizations',
    '~Optimize merged tiles',
    '~Optimize grid resizing',
    '~Optimize fixed tiles',
    '~Add transitions to laggy buttons',
    '~Memoize components',
  ],
  [
    'Puzzle editor',
    '~Puzzle code editor',
    '~Add color, fix and merge tools',
    '~Add a tool for each symbol type',
    '~Set up rule configuration UI',
    '~Hide rules behind search bar',
    '~Add puzzle metadata fields',
    '~Add difficulty field',
  ],
  [
    'Online features',
    'Puzzle URL shortener',
    'Editable puzzle URLs',
    'Simple stats tracking',
  ],
];

function renderString(item: string) {
  return (
    <li key={item} className={cn(item.startsWith('~') && 'opacity-50')}>
      <a>{item.startsWith('~') ? item.substring(1) : item}</a>
    </li>
  );
}

function renderItem(item: RoadmapItem) {
  if (typeof item === 'string') {
    return renderString(item);
  }
  const [title, ...subItems] = item;
  return (
    <li key={title}>
      <details open>
        <summary className={cn(title.startsWith('~') && 'opacity-50')}>
          {title.startsWith('~') ? title.substring(1) : title}
        </summary>
        <ul>{subItems.map(renderItem)}</ul>
      </details>
    </li>
  );
}

// million-ignore
export default memo(function Roadmap() {
  return roadmap.map(renderItem);
});
