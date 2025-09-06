import { memo, useEffect, useMemo } from 'react';
import { useToolbox } from '../contexts/ToolboxContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { Color } from '@logic-pad/core/data/primitives';
import { GridContext } from '../contexts/GridContext.tsx';
import { useHotkeys } from 'react-hotkeys-hook';
import { SiteSettings, useSettings } from '../contexts/SettingsContext.tsx';

type HotkeyLayout = {
  [layout in SiteSettings['keyboardLayout']]: {
    tools: string[];
    baseSymbols: string[];
    extraSymbols: string[];
    customSymbols: string[];
  };
};

const symbolsKeys = {
  baseSymbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  extraSymbols: [
    'alt+1',
    'alt+2',
    'alt+3',
    'alt+4',
    'alt+5',
    'alt+6',
    'alt+7',
    'alt+8',
    'alt+9',
    'alt+0',
  ],
  customSymbols: [
    'shift+1',
    'shift+2',
    'shift+3',
    'shift+4',
    'shift+5',
    'shift+6',
    'shift+7',
    'shift+8',
    'shift+9',
    'shift+0',
  ],
};

export const toolboxHotkeys: HotkeyLayout = {
  qwerty: {
    tools: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ...symbolsKeys,
  },
  azerty: {
    tools: ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ...symbolsKeys,
  },
  dvorak: {
    tools: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    ...symbolsKeys,
  },
  colemak: {
    tools: ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o'],
    ...symbolsKeys,
  },
};

export type ToolboxHotkey =
  `${keyof HotkeyLayout['qwerty']}-${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}`;

export interface ToolboxItemProps {
  id: string;
  name: string;
  description: string;
  gridOverlay: React.ReactNode;
  onTileClick:
    | ((
        x: number,
        y: number,
        target: Color,
        flood: boolean,
        gridContext: GridContext
      ) => void)
    | null;
  children: React.ReactNode;
  className?: string;
  hotkey?: ToolboxHotkey;
  order?: number;
  defaultHidden?: boolean;
  defaultSelected?: boolean;
}

export default memo(function ToolboxItem({
  id,
  name,
  description,
  gridOverlay,
  onTileClick,
  children,
  className,
  hotkey,
  order,
  defaultHidden,
  defaultSelected = false,
}: ToolboxItemProps) {
  const { toolId, setTool } = useToolbox();
  const [showMoreTools] = useSettings('showMoreTools');
  const [keyboardLayout] = useSettings('keyboardLayout');

  useEffect(() => {
    if (toolId === id) {
      setTool(id, name, description, gridOverlay, onTileClick);
    }
  }, [id, name, description, gridOverlay, onTileClick, setTool, toolId]);

  useEffect(() => {
    if (defaultSelected)
      setTool(id, name, description, gridOverlay, onTileClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hotkeyCode = useMemo(() => {
    if (!hotkey) return undefined;
    const [section, index] = hotkey.split('-');
    return toolboxHotkeys[keyboardLayout]?.[
      section as keyof HotkeyLayout['qwerty']
    ]?.[parseInt(index, 10)];
  }, [hotkey, keyboardLayout]);

  useHotkeys(
    [hotkeyCode ?? ''],
    () => setTool(id, name, description, gridOverlay, onTileClick),
    {
      preventDefault: true,
      keydown: hotkeyCode !== undefined,
      keyup: false,
    }
  );

  if (defaultHidden && !showMoreTools) return null;

  return (
    <div
      className="tooltip tooltip-info"
      data-tip={name + (hotkeyCode ? ` (${hotkeyCode})` : '')}
      style={{ order }}
    >
      <button
        type="button"
        aria-label={name}
        className={cn(
          'btn text-xl p-0 w-12',
          toolId === id && 'btn-primary',
          className
        )}
        onClick={() => setTool(id, name, description, gridOverlay, onTileClick)}
      >
        {children}
      </button>
    </div>
  );
});
