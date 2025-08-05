import { memo } from 'react';

export default memo(function EditorOnlineTab() {
  return (
    <div className="flex flex-col gap-4 p-8 bg-base-100 text-base-content rounded-2xl shadow-lg w-full max-w-[800px]">
      <p className="text-2xl">Online information</p>
      <div className="flex gap-2 items-center">
        <div className="badge badge-lg badge-info">Private</div>
        <div>Created at 1/4/2025 5:04 pm</div>
      </div>
      <div className="divider" />
      <p className="text-2xl">Publish puzzle</p>
      <p>
        Publish this puzzle for public access. Completion statistics will be
        available after publish.
      </p>
      <button className="btn btn-primary">Publish</button>
    </div>
  );
});
