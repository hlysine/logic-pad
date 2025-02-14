import { memo } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { FiExternalLink } from 'react-icons/fi';
import Difficulty from './Difficulty';
import DocumentTitle from '../components/DocumentTitle';
import Markdown from '../components/Markdown';
import { useGridState } from '../contexts/GridStateContext.tsx';

export default memo(function Metadata() {
  const { metadata } = useGrid();
  const { revealSpoiler } = useGridState();

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <DocumentTitle>{metadata.title} - Logic Pad</DocumentTitle>
      <Difficulty value={metadata.difficulty} />
      <h1 className="text-3xl lg:text-4xl flex-shrink-0">{metadata.title}</h1>
      <div className="badge badge-secondary lg:badge-lg rounded-lg flex-shrink-0">
        {metadata.author}
      </div>
      {metadata.link.trim().length > 0 && (
        <a
          className="btn btn-ghost justify-start flex-nowrap flex flex-shrink-0 btn-sm lg:btn-md"
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
      <div className="overflow-y-auto">
        <Markdown revealSpoiler={revealSpoiler} className="lg:text-lg">
          {metadata.description}
        </Markdown>
      </div>
    </div>
  );
});
