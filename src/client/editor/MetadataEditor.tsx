import { memo } from 'react';
import Difficulty from '../metadata/Difficulty';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../../client/uiHelper.ts';

// million-ignore
export default memo(function MetadataEditor() {
  const { metadata, setMetadata } = useGrid();
  return (
    <div className="flex flex-col gap-2">
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
      <label className="form-control">
        <div className="label">
          <span className="label-text">Difficulty</span>
        </div>
        <Difficulty
          value={metadata.difficulty}
          onChange={e => setMetadata({ ...metadata, difficulty: e })}
        />
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Link</span>
        </div>
        <input
          type="text"
          placeholder="Optional link to discussion"
          className="input input-bordered w-full"
          value={metadata.link}
          onChange={e => setMetadata({ ...metadata, link: e.target.value })}
        />
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Description</span>
        </div>
        <textarea
          className="textarea textarea-bordered h-24"
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
