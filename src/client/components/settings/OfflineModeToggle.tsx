import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function OfflineModeToggle() {
  const [offlineMode, setOfflineMode] = useSettings('offlineMode');
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Disable all online features"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Offline mode</span>
          <input
            type="checkbox"
            className="toggle"
            checked={offlineMode}
            onChange={e => setOfflineMode(e.currentTarget.checked)}
          />
        </label>
      </div>
    </div>
  );
});
