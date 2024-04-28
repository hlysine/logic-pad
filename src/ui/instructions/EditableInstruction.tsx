import { memo } from 'react';
import InstructionData from '../../data/instruction';
import { State } from '../../data/primitives';
import { FiTrash2 } from 'react-icons/fi';
import Rule from '../../data/rules/rule';
import InstructionBase from './InstructionBase';
import { useGrid } from '../GridContext';
import Config from '../configs/Config';
import { cn } from '../../utils';

export interface InstructionProps {
  instruction: InstructionData;
  state?: State;
}

export default memo(function EditableInstruction({
  instruction,
  state,
}: InstructionProps) {
  const { grid, setGrid } = useGrid();

  const display = (
    <InstructionBase instruction={instruction} state={state}>
      {instruction instanceof Rule && (
        <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100">
          <button
            className="btn btn-accent btn-square shadow-glow-md shadow-accent text-accent-content"
            onClick={() => setGrid(grid.removeRule(instruction))}
          >
            <FiTrash2 size={24} />
          </button>
        </div>
      )}
    </InstructionBase>
  );

  if (instruction instanceof Rule) {
    return (
      <div className="dropdown dropdown-left">
        <div
          tabIndex={0}
          role="button"
          className={cn(
            instruction.configs !== null ? 'cursor-pointer' : 'cursor-default'
          )}
        >
          {display}
        </div>
        {instruction.configs !== null && (
          <div
            tabIndex={0}
            className="p-4 m-2 dropdown-content z-[1] bg-base-300 text-base-content shadow-xl rounded-box w-[400px]"
          >
            {instruction.configs
              ?.filter(config => config.configurable)
              .map(config => (
                <Config
                  key={`${config.field}: ${config.type}`}
                  instruction={instruction}
                  config={config}
                  setConfig={(field, value) => {
                    const newInstruction = instruction.copyWith({
                      [field]: value,
                    });
                    setGrid(grid.replaceRule(instruction, newInstruction));
                  }}
                />
              ))}
          </div>
        )}
      </div>
    );
  } else {
    return display;
  }
});
