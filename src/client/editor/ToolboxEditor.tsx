import { memo, useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext.tsx';
import { allTools } from './tools';
import { cn } from '../../client/uiHelper.ts';
import GridSizeEditor from './GridSizeEditor';
import { GridConsumer } from '../contexts/GridContext.tsx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import SymbolTool from './SymbolTool';
import { allSymbols } from '../symbols';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';

export default memo(function ToolboxEditor() {
  const { toolId, name, description, setTool, presets, setPresets } =
    useToolbox();

  useEffect(() => {
    setTool(null, null, null, null, null);
    return () => setTool(null, null, null, null, null);
  }, [setTool]);

  const selectedPreset = presets.find(
    preset => preset.symbol.id + '_' + preset.name === toolId
  );

  const presetTools = presets.map(preset => (
    <SymbolTool
      key={preset.name}
      name={preset.name}
      id={preset.symbol.id + '_' + preset.name}
      sample={preset.symbol}
      component={allSymbols.get(preset.symbol.id)!.component}
    />
  ));

  return (
    <div className="flex flex-col gap-2">
      <GridConsumer>
        {({ grid, setGrid }) => (
          <GridSizeEditor grid={grid} setGrid={setGrid} />
        )}
      </GridConsumer>
      <span className="divider mt-0 mb-0"></span>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">{name ?? 'No tool selected'}</span>
        <span
          className={cn(
            'inline-block text-sm h-0 transition-[height]',
            description && 'h-[2.5em]'
          )}
        >
          {description}
        </span>
      </div>
      <span className="divider mt-0 mb-0"></span>
      <div className="flex flex-wrap gap-2 justify-center">
        {allTools.map((Tool, i) => (
          <Tool key={i} />
        ))}
        <GridConsumer>
          {({ grid }) => (
            <InstructionPartOutlet
              grid={grid}
              placement={PartPlacement.Toolbox}
            />
          )}
        </GridConsumer>
      </div>
      <span className="divider mt-0 mb-0"></span>
      <div className="flex gap-4 justify-between items-center pr-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Presets</span>
          <span className="text-sm">
            Quickly place identical symbols with presets.
          </span>
        </div>
        <div
          className="tooltip tooltip-left tooltip-info"
          data-tip="Remove selected preset"
        >
          <button
            type="button"
            aria-label="Remove selected preset"
            className="btn btn-square"
            disabled={!selectedPreset}
            onClick={() =>
              setPresets(presets.filter(x => x !== selectedPreset))
            }
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {presetTools.length > 0 ? (
          presetTools
        ) : (
          <span className="text-xs opacity-70 p-4">No presets saved.</span>
        )}
      </div>
    </div>
  );
});
