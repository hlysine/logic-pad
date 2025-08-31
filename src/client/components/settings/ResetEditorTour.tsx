import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { cn } from '../../uiHelper';

export default memo(function ResetEditorTour() {
  const [runEditorTour, setRunEditorTour] = useSettings('runEditorTour');
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip={
        runEditorTour
          ? 'Go to the editor to see the tour'
          : 'Show the editor tour when you open the editor'
      }
    >
      <button
        className={cn('btn', runEditorTour && 'btn-disabled')}
        onClick={() => {
          setRunEditorTour(true);
        }}
      >
        Reset Editor Tour
      </button>
    </div>
  );
});
