import { memo } from 'react';
import { CollectionBrief, ResourceStatus } from './data';
import { FaEyeSlash, FaListOl, FaListUl, FaUser } from 'react-icons/fa';
import { cn } from '../uiHelper';
import { TbLayoutGrid } from 'react-icons/tb';

export interface CollectionCardProps {
  collection: CollectionBrief;
  expandable?: boolean;
  onClick?: () => void;
}

export default memo(function CollectionCard({
  collection,
  expandable = true,
  onClick,
}: CollectionCardProps) {
  return (
    <div className="w-[320px] h-[96px] hover:z-50 shrink-0 grow-0">
      <div
        className={cn(
          'w-full h-full hover:h-fit flex gap-4 items-center px-4 py-2 rounded-xl shadow-md wrapper hover:shadow-xl transition-all text-base-content',
          collection.status === ResourceStatus.Private
            ? `bg-base-300/50 hover:bg-base-100/50`
            : 'bg-base-300 hover:bg-base-100'
        )}
        role="button"
        onClick={onClick}
      >
        {collection.isSeries ? (
          <FaListOl size={36} className="shrink-0 text-accent" />
        ) : (
          <FaListUl size={36} className="shrink-0" />
        )}
        <div className="flex flex-col">
          <h2
            className={cn(
              'text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis',
              expandable && '[.wrapper:hover_&]:whitespace-normal',
              collection.isSeries && 'text-accent'
            )}
          >
            {collection.title.length === 0
              ? 'Untitled Collection'
              : collection.title}
          </h2>
          <div className="badge badge-neutral bg-neutral/40 badge-md mt-1">
            {collection.creator.name}
          </div>
          <div className="flex gap-4 text-sm opacity-80 mt-2">
            {collection.puzzleCount !== null && (
              <span className="flex items-center">
                <TbLayoutGrid className="me-2" /> {collection.puzzleCount}
                <span className="hidden [.wrapper:hover_&]:inline-block ms-1">
                  {collection.puzzleCount === 1 ? 'puzzle' : 'puzzles'}
                </span>
              </span>
            )}
            {collection.status === ResourceStatus.Public ? (
              <span className="flex items-center">
                <FaUser className="me-2" /> {collection.followCount}
                <span className="hidden [.wrapper:hover_&]:inline-block ms-1">
                  {collection.followCount === 1 ? 'follow' : 'follows'}
                </span>
              </span>
            ) : (
              <span className="flex items-center">
                <FaEyeSlash className="me-2" />
                Private
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
