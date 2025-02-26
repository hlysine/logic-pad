import { memo } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { FiExternalLink } from 'react-icons/fi';
import Difficulty from './Difficulty';
import DocumentTitle from '../components/DocumentTitle';
import Markdown from '../components/Markdown';
import { useGridState } from '../contexts/GridStateContext.tsx';
import { cn } from '../uiHelper.ts';

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

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <DocumentTitle>{metadata.title} - Logic Pad</DocumentTitle>
      <Difficulty value={metadata.difficulty} />
      <h1
        className={cn(
          'flex-shrink-0',
          responsive ? 'text-3xl lg:text-4xl' : 'text-4xl'
        )}
      >
        {metadata.title}
      </h1>
      <div
        className={cn(
          'badge badge-secondary  rounded-lg flex-shrink-0',
          responsive ? 'lg:badge-lg' : 'badge-lg'
        )}
      >
        {metadata.author}
      </div>
      {!simplified && metadata.link.trim().length > 0 && (
        <a
          className={cn(
            'btn btn-ghost justify-start flex-nowrap flex flex-shrink-0',
            responsive ? 'btn-sm lg:btn-md' : 'btn-md'
          )}
          href={metadata.link}
          target="_blank"
          rel="noreferrer"
        >
          <span className="whitespace-nowrap text-ellipsis grow overflow-x-clip">
            {metadata.link}
          </span>
          <FiExternalLink size={24} />
        </a>
      )}
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
