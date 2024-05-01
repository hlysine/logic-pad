import { memo } from 'react';
import MetadataEditor from './MetadataEditor';
import ToolboxEditor from './ToolboxEditor';
import { useEmbed } from '../EmbedContext';
import Accordion from '../components/Accordion';

export default memo(function GUIEditor() {
  const { features } = useEmbed();
  return (
    <div className="flex flex-col grow-0 gap-2 overflow-y-auto overflow-x-visible">
      <Accordion title="Toolbox">
        <ToolboxEditor />
      </Accordion>
      {features.metadata && (
        <Accordion title="Metadata">
          <MetadataEditor />
        </Accordion>
      )}
    </div>
  );
});
