import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function WrapAroundVisualizationToggle() {
  const [visualizeWrapArounds, setVisualizeWrapArounds] = useSettings(
    'visualizeWrapArounds'
  );
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Whether to visualize edges of wrap-around grids"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Visualize wrap-around grids</span>
          <input
            type="checkbox"
            className="toggle"
            checked={visualizeWrapArounds}
            onChange={e => setVisualizeWrapArounds(e.currentTarget.checked)}
          />
        </label>
      </div>
    </div>
  );
});
