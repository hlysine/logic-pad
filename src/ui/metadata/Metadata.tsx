import { memo } from 'react';
import { useGrid } from '../GridContext';
import { FiExternalLink } from 'react-icons/fi';
import Difficulty from './Difficulty';
import DocumentTitle from '../components/DocumentTitle';

export default memo(function Metadata() {
  const { metadata } = useGrid();

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <DocumentTitle>{metadata.title} - Logic Pad</DocumentTitle>
      <Difficulty value={metadata.difficulty} />
      <h1 className="text-4xl">{metadata.title}</h1>
      <div className="badge badge-secondary badge-lg rounded-lg">
        {metadata.author}
      </div>
      {metadata.link.trim().length > 0 && (
        <a
          className="btn btn-ghost justify-start flex-nowrap flex"
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
      <div>{metadata.description}</div>
    </div>
  );
});
