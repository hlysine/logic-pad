import { memo } from 'react';
import { externalReducedMotion } from '../../uiHelper';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function AnimationToggle() {
  const [enableFancyAnimations, setEnableFancyAnimations] = useSettings(
    'enableFancyAnimations'
  );
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
            checked={external ? false : enableFancyAnimations}
            disabled={external}
            onChange={e => setEnableFancyAnimations(e.currentTarget.checked)}
          />
        </label>
      </div>
    </div>
  );
});
