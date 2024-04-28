import { memo, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '../../utils';
import { SUPPORTED_THEMES, themeKey, useTheme } from '../ThemeContext';
import { useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

export default memo(function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const monaco = useMonaco();

  useEffect(() => {
    console.log(theme);
    document.documentElement.dataset.theme = theme;
    const editorTheme = SUPPORTED_THEMES.find(([t]) => t === theme)?.[1];
    if (monaco && editorTheme) {
      import(`../../../node_modules/monaco-themes/themes/${editorTheme}.json`)
        .then(data => {
          monaco.editor.defineTheme(
            editorTheme,
            data as editor.IStandaloneThemeData
          );
          monaco.editor.setTheme(editorTheme);
        })
        .catch(() => {
          monaco.editor.setTheme(editorTheme);
        })
        .catch(console.log);
    }
  }, [theme, monaco]);

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
        className="dropdown-content z-50 p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-[calc(100dvh-100px)] overflow-y-auto"
      >
        {SUPPORTED_THEMES.map(([themeChoice]) => (
          <li key={themeChoice}>
            <input
              type="radio"
              name="theme-dropdown"
              className={cn(
                'btn btn-sm btn-block btn-ghost justify-start capitalize',
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
