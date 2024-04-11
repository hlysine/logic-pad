import { useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { memo, useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '../../utils';

export const themeKey = 'theme';

const SUPPORTED_THEMES = [
  ['light', 'vs'],
  ['dark', 'vs-dark'],
  ['cupcake', 'vs'],
  ['bumblebee', 'vs'],
  ['emerald', 'vs'],
  ['corporate', 'vs'],
  ['synthwave', 'Cobalt'],
  ['retro', 'Solarized-light'],
  ['cyberpunk', 'Solarized-light'],
  ['valentine', 'vs'],
  ['halloween', 'vs-dark'],
  ['garden', 'vs'],
  ['forest', 'hc-black'],
  ['aqua', 'Tomorrow-Night-Blue'],
  ['lofi', 'hc-black'],
  ['pastel', 'GitHub'],
  ['fantasy', 'vs-dark'],
  ['wireframe', 'GitHub'],
  ['black', 'vs-dark'],
  ['luxury', 'vs-dark'],
  ['dracula', 'Dracula'],
  ['cmyk', 'vs'],
  ['autumn', 'vs'],
  ['business', 'vs-dark'],
  ['acid', 'vs'],
  ['lemonade', 'Solarized-light'],
  ['night', 'vs-dark'],
  ['coffee', 'vs-dark'],
  ['winter', 'vs'],
  ['dim', 'vs-dark'],
  ['nord', 'vs'],
  ['sunset', 'vs-dark'],
];

export default memo(function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem(themeKey) ?? 'dark'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme;
  }, [selectedTheme]);

  const monaco = useMonaco();

  const switchTheme = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem(themeKey, theme);
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
  };

  useEffect(() => {
    switchTheme(selectedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco]);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <FiChevronDown />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-[calc(100dvh-100px)] overflow-y-auto"
      >
        {SUPPORTED_THEMES.map(([theme]) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className={cn(
                'theme-controller btn btn-sm btn-block btn-ghost justify-start capitalize',
                selectedTheme === theme && 'btn-primary'
              )}
              aria-label={theme}
              value={theme}
              onChange={e => switchTheme(e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});
