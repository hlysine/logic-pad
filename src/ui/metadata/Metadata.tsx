import { memo } from 'react';
import { useGrid } from '../GridContext';
import { FiExternalLink } from 'react-icons/fi';
import Difficulty from './Difficulty';

export default memo(function Metadata() {
  const { metadata } = useGrid();

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <Difficulty value={metadata.difficulty} />
      <h1 className="text-4xl">{metadata.title}</h1>
      <div className="badge badge-secondary badge-lg rounded-lg">
        {metadata.author}
      </div>
      {metadata.link.trim().length > 0 && (
        <button className="btn btn-ghost justify-start flex-nowrap">
          <span className="whitespace-nowrap text-ellipsis overflow-hidden">
            {metadata.link}
          </span>
          <FiExternalLink size={24} />
        </button>
      )}
      <div>{metadata.description}</div>
    </div>
  );
});
