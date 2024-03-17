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
    'Dart number',
    'Lotus',
    'Spiral',
    'All ___ regions have area #',
    'Exactly # symbols per ___ region',
  ],
  '~Add win confirmation',
  '~Add undo and restart',
  'Add flood painting',
  'Add tile counting by holding Ctrl',
  'Implement puzzle serialization',
  [
    'Optimizations',
    'Optimize merged cells',
    '~Add transitions to laggy buttons',
    '~Memoize components',
  ],
  [
    'Puzzle editor',
    'Add color, fix and merge tools',
    'Add a tool for each symbol type',
    'Hide tools behind search bar',
    'Add configurations for each rule',
    'Hide rules behind search bar',
    'Add puzzle name and author fields',
    'Add difficulty field',
  ],
];

function renderString(item: string) {
  return (
    <li className={cn(item.startsWith('~') && 'opacity-50')}>
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
    <li>
      <details open>
        <summary className={cn(title.startsWith('~') && 'opacity-50')}>
          {title.startsWith('~') ? title.substring(1) : title}
        </summary>
        <ul>{subItems.map(renderItem)}</ul>
      </details>
    </li>
  );
}

export default memo(function Roadmap() {
  return (
    <ul className="menu menu-vertical flex-nowrap bg-base-200 rounded-box overflow-y-auto overflow-x-visible basis-0 flex-1 justify-self-stretch">
      {roadmap.map(renderItem)}
    </ul>
  );
});
