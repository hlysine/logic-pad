import { memo } from 'react';
import MetadataEditor from './MetadataEditor';
import ToolboxEditor from './ToolboxEditor';
import { useEmbed } from '../contexts/EmbedContext.tsx';
import Accordion from '../components/Accordion';

export default memo(function GUIEditor() {
  const { features } = useEmbed();
  return (
    <div className="grow overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-2">
        <Accordion title="Toolbox">
          <ToolboxEditor />
        </Accordion>
        {features.metadata && (
          <Accordion title="Metadata">
            <MetadataEditor />
          </Accordion>
        )}
      </div>
    </div>
  );
});
