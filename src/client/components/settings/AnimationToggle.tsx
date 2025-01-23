import { memo, useState } from 'react';
import { externalReducedMotion, siteOptions } from '../../uiHelper';

export default memo(function AnimationToggle() {
  const [reduceMotion, setReduceMotion] = useState(
    siteOptions.reducedMotionOverride
  );
  const toggleReduceMotion = () => {
    setReduceMotion(sa => {
      const val = !sa;
      siteOptions.reducedMotionOverride = val;
      window.localStorage.setItem('reducedMotion', String(val));
      return val;
    });
  };
  const external = externalReducedMotion();
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip={
        external
          ? 'Fancy animations are disabled by the browser'
          : 'Toggle fancy animations'
      }
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Enable fancy animations</span>
          <input
            type="checkbox"
            className="toggle"
            checked={external ? false : !reduceMotion}
            disabled={external}
            onChange={toggleReduceMotion}
          />
        </label>
      </div>
    </div>
  );
});
