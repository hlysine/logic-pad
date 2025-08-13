import { memo } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import Difficulty from './Difficulty';
import Markdown from '../components/Markdown';
import { useGridState } from '../contexts/GridStateContext.tsx';
import { cn } from '../uiHelper.ts';
import UserCard from './UserCard.tsx';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext.tsx';
import DocumentTitle from '../components/DocumentTitle.tsx';

export interface MetadataProps {
  simplified?: boolean;
  responsive?: boolean;
}

export default memo(function Metadata({
  simplified,
  responsive,
}: MetadataProps) {
  simplified = simplified ?? false;
  responsive = responsive ?? true;
  const { metadata } = useGrid();
  const { revealSpoiler } = useGridState();
  const { puzzle } = useOnlinePuzzle();

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <DocumentTitle>{metadata.title} - Logic Pad</DocumentTitle>
      <div
        className="tooltip tooltip-info tooltip-right w-fit"
        data-tip={`Design difficulty: ${metadata.difficulty}`}
      >
        <Difficulty value={metadata.difficulty} />
      </div>
      <h1
        className={cn(
          'flex-shrink-0',
          responsive ? 'text-3xl lg:text-4xl' : 'text-4xl'
        )}
      >
        {metadata.title}
      </h1>
      <UserCard user={puzzle?.creator} name={metadata.author} />
      {!simplified && (
        <div className="overflow-y-auto">
          <Markdown
            revealSpoiler={revealSpoiler}
            className={responsive ? 'lg:text-lg' : 'text-lg'}
          >
            {metadata.description}
          </Markdown>
        </div>
      )}
    </div>
  );
});
