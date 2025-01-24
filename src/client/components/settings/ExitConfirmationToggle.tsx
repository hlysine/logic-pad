import { memo, useState } from 'react';
import { siteOptions } from '../../uiHelper';

export default memo(function ExitConfirmationToggle() {
  const [bypassExitConfirmation, setBypassExitConfirmation] = useState(
    siteOptions.bypassExitConfirmation
  );
  const toggleExitConfirmation = () => {
    setBypassExitConfirmation(sa => {
      const val = !sa;
      siteOptions.bypassExitConfirmation = val;
      window.localStorage.setItem('bypassExitConfirmation', String(val));
      return val;
    });
  };
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
            onChange={toggleExitConfirmation}
          />
        </label>
      </div>
    </div>
  );
});
