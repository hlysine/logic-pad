import { memo } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '../../utils';
import { SUPPORTED_THEMES, themeKey, useTheme } from '../ThemeContext';

export default memo(function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem(themeKey, newTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <FiChevronDown />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 p-2 shadow-2xl bg-base-300 text-base-content rounded-box w-52 max-h-[calc(100dvh-100px)] overflow-y-auto"
      >
        {SUPPORTED_THEMES.map(([themeChoice]) => (
          <li key={themeChoice}>
            <input
              type="radio"
              name="theme-dropdown"
              className={cn(
                'theme-controller btn btn-sm btn-block btn-ghost justify-start capitalize', // theme-controller is required to change CSS styles before the theme context is set
                theme === themeChoice && 'btn-primary'
              )}
              aria-label={themeChoice}
              value={themeChoice}
              onChange={e => switchTheme(e.currentTarget.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});
