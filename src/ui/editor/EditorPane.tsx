import { Suspense, lazy, memo, useState } from 'react';
import { cn } from '../../utils';
import Loading from '../components/Loading';

const GUIEditor = lazy(() => import('./GUIEditor'));
const SourceCodeEditor = lazy(() => import('./SourceCodeEditor'));

const panes = [
  ['GUI', <GUIEditor key="GUI" />],
  ['Code', <SourceCodeEditor key="Code" loading={<Loading />} />],
] as const;

export default memo(function EditorPane() {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="flex-1 flex flex-col gap-2">
      <div role="tablist" className="tabs tabs-bordered shrink-0">
        {panes.map(([name], i) => (
          <a
            key={name}
            role="tab"
            className={cn('tab', activeTab === i && 'tab-active')}
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
