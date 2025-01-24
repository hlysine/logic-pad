import { memo, useState } from 'react';
import { siteOptions } from '../../uiHelper';

export default memo(function PrimaryMouseButtonToggle() {
  const [flippedPrimaryButton, setFlippedPrimaryButton] = useState(
    siteOptions.flipPrimaryMouseButton
  );
  const togglePrimaryButton = () => {
    setFlippedPrimaryButton(sa => {
      const val = !sa;
      siteOptions.flipPrimaryMouseButton = val;
      window.localStorage.setItem('flipPrimaryMouseButton', String(val));
      return val;
    });
  };
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Whether to use white for left click (Reload to take effect)"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Flip mouse buttons by default</span>
          <input
            type="checkbox"
            className="toggle"
            checked={flippedPrimaryButton}
            onChange={togglePrimaryButton}
          />
        </label>
      </div>
    </div>
  );
});
