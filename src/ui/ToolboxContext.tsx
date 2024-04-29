import { createContext, memo, useCallback, useContext, useState } from 'react';
import { Color } from '../data/primitives';
import { GridContext } from './GridContext';

interface ToolboxContext {
  toolId: string | null;
  name: string | null;
  description: string | null;
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
  setTool: (
    toolId: string | null,
    name: string | null,
    description: string | null,
    gridOverlay: React.ReactNode,
    onTileClick:
      | ((
          x: number,
          y: number,
          target: Color,
          flood: boolean,
          gridContext: GridContext
        ) => void)
      | null
  ) => void;
}

const context = createContext<ToolboxContext>({
  toolId: null,
  name: null,
  description: null,
  gridOverlay: null,
  onTileClick: null,
  setTool: () => {},
});

export const useToolbox = () => {
  return useContext(context);
};

export const ToolboxConsumer = context.Consumer;

export default memo(function ToolboxContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toolId, setToolId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [gridOverlay, setGridOverlay] = useState<React.ReactNode>(null);
  const [onTileClick, setOnTileClick] = useState<
    ((x: number, y: number, target: Color, flood: boolean) => void) | null
  >(null);

  const setTool = useCallback<ToolboxContext['setTool']>(
    (toolId, name, description, gridOverlay, onTileClick) => {
      setToolId(toolId);
      setName(name);
      setDescription(description);
      setGridOverlay(gridOverlay);
      setOnTileClick(() => onTileClick);
    },
    [setToolId, setName, setDescription, setGridOverlay, setOnTileClick]
  );

  return (
    <context.Provider
      value={{
        toolId,
        name,
        description,
        gridOverlay,
        onTileClick,
        setTool,
      }}
    >
      {children}
    </context.Provider>
  );
});
