import { memo } from 'react';
import Difficulty from '../metadata/Difficulty.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { useOnline } from '../contexts/OnlineContext.tsx';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext.tsx';

// million-ignore
export default memo(function MetadataEditor() {
  const { metadata, setMetadata } = useGrid();
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();

  return (
    <div className="bg-base-100 text-base-content rounded-2xl p-4 flex flex-col grow h-full gap-2 shadow">
      <label className="form-control">
        <div className="label">
          <span className="label-text">Title</span>
        </div>
        <input
          type="text"
          placeholder="Required"
          className={cn(
            'input input-bordered w-full',
            metadata.title === '' && 'input-error'
          )}
          value={metadata.title}
          onChange={e => setMetadata({ ...metadata, title: e.target.value })}
        />
      </label>
      {isOnline && (!!id || !!me) ? (
        <label className="form-control">
          <div className="label">
            <span className="label-text">Author</span>
          </div>
          <div className="badge badge-lg badge-secondary rounded-lg flex-shrink-0">
            {id ? metadata.author : me!.name}
          </div>
        </label>
      ) : (
        <label className="form-control">
          <div className="label">
            <span className="label-text">Author</span>
          </div>
          <input
            type="text"
            placeholder="Required"
            className={cn(
              'input input-bordered w-full',
              metadata.author === '' && 'input-error'
            )}
            value={metadata.author}
            onChange={e => setMetadata({ ...metadata, author: e.target.value })}
          />
        </label>
      )}
      <label className="form-control">
        <div className="label">
          <span className="label-text">Design difficulty</span>
        </div>
        <Difficulty
          value={metadata.difficulty}
          onChange={e => setMetadata({ ...metadata, difficulty: e })}
        />
      </label>
      <label className="form-control flex-1">
        <div className="label">
          <span className="label-text">Description</span>
        </div>
        <textarea
          className="textarea textarea-bordered h-full resize-none"
          placeholder="Optional text"
          value={metadata.description}
          onChange={e =>
            setMetadata({ ...metadata, description: e.target.value })
          }
        ></textarea>
      </label>
    </div>
  );
});
