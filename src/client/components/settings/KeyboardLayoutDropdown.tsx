import { memo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default memo(function KeyboardLayoutDropdown() {
  const [keyboardLayout, setKeyboardLayout] = useSettings('keyboardLayout');
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Select your keyboard layout for hotkeys"
    >
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Keyboard Layout</span>
          <select
            className="select select-bordered"
            value={keyboardLayout}
            onChange={e => setKeyboardLayout(e.currentTarget.value as any)}
          >
            <option value="qwerty">Qwerty</option>
            <option value="azerty">Azerty</option>
            <option value="dvorak">Dvorak</option>
            <option value="colemak">Colemak</option>
          </select>
        </label>
      </div>
    </div>
  );
});
