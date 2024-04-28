import { memo } from 'react';
import MetadataEditor from './MetadataEditor';

export default memo(function GUIEditor() {
  return (
    <div className="flex flex-col grow-0 gap-2 overflow-y-auto">
      <div className="collapse collapse-arrow shrink-0 bg-base-100">
        <input
          type="checkbox"
          name="gui-editor-accordion"
          defaultChecked={true}
        />
        <div className="collapse-title font-medium">Toolbox</div>
        <div className="collapse-content">Coming soon</div>
      </div>
      <div className="collapse collapse-arrow shrink-0 bg-base-100">
        <input
          type="checkbox"
          name="gui-editor-accordion"
          defaultChecked={true}
        />
        <div className="collapse-title font-medium">Metadata</div>
        <div className="collapse-content">
          <MetadataEditor />
        </div>
      </div>
    </div>
  );
});
