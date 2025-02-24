import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function ExitConfirmationToggle() {
  const [bypassExitConfirmation, setBypassExitConfirmation] = useSettings(
    'bypassExitConfirmation'
  );
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Whether Logic Pad should ask for confirmation before leaving the page"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Enable exit confirmations</span>
          <input
            type="checkbox"
            className="toggle"
            checked={!bypassExitConfirmation}
            onChange={() => setBypassExitConfirmation(!bypassExitConfirmation)}
          />
        </label>
      </div>
    </div>
  );
});
