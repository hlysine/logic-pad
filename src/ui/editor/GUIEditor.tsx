import { memo } from 'react';
import MetadataEditor from './MetadataEditor';
import ToolboxEditor from './ToolboxEditor';

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="collapse collapse-arrow shrink-0 bg-base-100 overflow-visible">
      <input
        type="checkbox"
        name="gui-editor-accordion"
        defaultChecked={true}
      />
      <div className="collapse-title font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}

export default memo(function GUIEditor() {
  return (
    <div className="flex flex-col grow-0 gap-2 overflow-y-auto overflow-x-visible">
      <Accordion title="Toolbox">
        <ToolboxEditor />
      </Accordion>
      <Accordion title="Metadata">
        <MetadataEditor />
      </Accordion>
    </div>
  );
});
