import { createContext, memo, useContext, useState } from 'react';

export const themeKey = 'theme';

export const SUPPORTED_THEMES = [
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

interface ThemeContext {
  theme: string;
  setTheme: (value: string) => void;
}

const context = createContext<ThemeContext>({
  theme: localStorage.getItem(themeKey) ?? 'dark',
  setTheme: () => {},
});

export const useTheme = () => {
  return useContext(context);
};

export const ThemeConsumer = context.Consumer;

export default memo(function ThemeContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(themeKey) ?? 'dark'
  );

  return (
    <context.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </context.Provider>
  );
});
