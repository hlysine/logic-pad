import { Suspense, lazy, memo, useEffect, useState } from 'react';
import { cn } from '../uiHelper.ts';
import Loading from '../components/Loading.tsx';
import MetadataEditor from './MetadataEditor.tsx';

const ToolboxEditor = lazy(() => import('./ToolboxEditor.tsx'));
const SourceCodeEditor = lazy(() => import('./SourceCodeEditor.tsx'));

const panes = [
  ['Info', <MetadataEditor key="Info" />],
  ['Tools', <ToolboxEditor key="Tools" />],
  ['Code', <SourceCodeEditor key="Code" loading={<Loading />} />],
] as const;

export interface EditorSideTabsProps {
  editorMode: 'grid' | 'info';
  onEditorModeChange: (mode: 'grid' | 'info') => void;
}

export default memo(function EditorSideTabs({
  editorMode,
  onEditorModeChange,
}: EditorSideTabsProps) {
  const [activeTab, setActiveTab] = useState(1);
  useEffect(() => {
    if (activeTab === 0 && editorMode !== 'info') {
      onEditorModeChange('info');
    } else if (activeTab > 0 && editorMode !== 'grid') {
      onEditorModeChange('grid');
    }
  }, [activeTab, editorMode, onEditorModeChange]);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div role="tablist" className="tabs tabs-bordered shrink-0">
        {panes.map(([name], i) => (
          <a
            key={name}
            role="tab"
            className={cn(
              'tab text-neutral-content',
              activeTab === i && 'tab-active',
              i === 0 && 'bg-primary text-primary-content font-bold'
            )}
            onClick={() => setActiveTab(i)}
          >
            {name}
          </a>
        ))}
      </div>
      <Suspense fallback={<Loading />}>{panes[activeTab][1]}</Suspense>
    </div>
  );
});
