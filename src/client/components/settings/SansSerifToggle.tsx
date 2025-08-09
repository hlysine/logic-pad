import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function SansSerifToggle() {
  const [sansSerif, setSansSerif] = useSettings('sansSerifFont');
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Use a sans-serif font for the whole site"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Sans-serif font</span>
          <input
            type="checkbox"
            className="toggle"
            checked={sansSerif}
            onChange={e => setSansSerif(e.currentTarget.checked)}
          />
        </label>
      </div>
    </div>
  );
});
