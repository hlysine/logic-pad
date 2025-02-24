import { memo } from 'react';
import { externalReducedMotion } from '../../uiHelper';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function AnimationToggle() {
  const [reduceMotion, setReduceMotion] = useSettings('reducedMotionOverride');
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
            onChange={() => setReduceMotion(!reduceMotion)}
          />
        </label>
      </div>
    </div>
  );
});
