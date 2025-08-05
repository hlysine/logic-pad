import { Suspense, lazy, memo, useState } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from '../components/Loading';
import MetadataEditor from './MetadataEditor.tsx';

const ToolboxEditor = lazy(() => import('./ToolboxEditor'));
const SourceCodeEditor = lazy(() => import('./SourceCodeEditor'));

const panes = [
  ['Info', <MetadataEditor key="Info" />],
  ['Tools', <ToolboxEditor key="Tools" />],
  ['Code', <SourceCodeEditor key="Code" loading={<Loading />} />],
] as const;

export default memo(function EditorPane() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex-1 flex flex-col gap-2">
      <div role="tablist" className="tabs tabs-bordered shrink-0">
        {panes.map(([name], i) => (
          <a
            key={name}
            role="tab"
            className={cn(
              'tab text-neutral-content',
              activeTab === i && 'tab-active'
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
