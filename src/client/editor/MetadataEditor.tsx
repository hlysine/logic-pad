import { memo, useEffect } from 'react';
import Difficulty from '../metadata/Difficulty.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { useOnline } from '../contexts/OnlineContext.tsx';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext.tsx';
import UserCard from '../metadata/UserCard.tsx';

// million-ignore
export default memo(function MetadataEditor() {
  const { metadata, setMetadata } = useGrid();
  const { isOnline, me } = useOnline();
  const { id, puzzle } = useOnlinePuzzle();

  useEffect(() => {
    if (isOnline && !id && me !== null && metadata.author !== me.name) {
      setMetadata({ ...metadata, author: me.name });
    }
  }, [isOnline, id, me, metadata, setMetadata]);

  return (
    <div className="bg-base-100 text-base-content rounded-2xl p-4 flex flex-col grow h-full gap-2 shadow">
      <label className="form-control">
        <div className="label">
          <span className="label-text">Title</span>
          <span className="label-text text-sm opacity-70 self-end">
            {metadata.title.length}/100
          </span>
        </div>
        <input
          type="text"
          placeholder="Required"
          maxLength={100}
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
          <UserCard user={puzzle?.creator ?? me} />
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
            maxLength={100}
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
          <span className="label-text text-sm opacity-70 self-end">
            {metadata.description.length}/500
          </span>
        </div>
        <textarea
          className="textarea textarea-bordered h-full resize-none"
          placeholder="Optional text"
          maxLength={500}
          value={metadata.description}
          onChange={e =>
            setMetadata({ ...metadata, description: e.target.value })
          }
        ></textarea>
      </label>
    </div>
  );
});
