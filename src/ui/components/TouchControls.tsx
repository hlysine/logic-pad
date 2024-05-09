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
    <div className="flex shrink-0 items-center shadow-xl rounded-box bg-base-100 text-base-content fixed bottom-16 z-40 left-2 right-2 xl:static xl:shadow-md">
      <div
        className="tooltip tooltip-top flex tooltip-info flex-1"
        data-tip="Resize grid"
      >
        <input
          type="range"
          min={-1}
          max={1}
          step={0.1}
          value={Math.log2(scale)}
          onChange={e => setScale(2 ** Number(e.currentTarget.value))}
          className="range m-2"
        />
      </div>
      <div
        className="tooltip tooltip-left xl:tooltip-top flex tooltip-info"
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
