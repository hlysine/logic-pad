import { memo, useState } from 'react';
import mouseContext from '../grid/MouseContext';
import { useDisplay } from '../DisplayContext';

export default memo(function TouchControls() {
  const [inverted, setInverted] = useState(false);
  const { scale, setScale } = useDisplay();
  const onSwitch = () => {
    setInverted(i => {
      const newValue = !i;
      mouseContext.setInverted(newValue);
      return newValue;
    });
  };
  return (
    <div className="flex items-center shadow-md rounded-box w-full bg-base-100">
      <div
        className="tooltip tooltip-top flex tooltip-info flex-1"
        data-tip="Resize grid"
      >
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={scale}
          onChange={e => setScale(Number(e.currentTarget.value))}
          className="range m-2"
        />
      </div>
      <div
        className="tooltip tooltip-top flex tooltip-info"
        data-tip="Toggle primary color"
      >
        <label className="swap swap-flip">
          <input type="checkbox" checked={inverted} onChange={onSwitch} />
          <div className="swap-on bg-white text-black text-center p-2 px-4 rounded-box">
            W
          </div>
          <div className="swap-off bg-black text-white text-center p-2 px-4 rounded-box">
            B
          </div>
        </label>
      </div>
    </div>
  );
});
