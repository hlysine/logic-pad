import { memo } from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import Rule from '../../data/rules/rule';
import InstructionBase from './InstructionBase';
import { useGrid } from '../GridContext';
import Config from '../configs/Config';
import { InstructionProps } from './EditableInstruction';

export default memo(function EditableInstruction({
  instruction, state,
}: InstructionProps) {
  const { grid, setGrid } = useGrid();
  const [open, setOpen] = useState(false);
  return (
        <details className="dropdown dropdown-left" onBlur=>
      <summary className="cursor-pointer">
        <InstructionBase instruction={instruction} state={state}>
          {instruction instanceof Rule && (
                <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100">
              <button className="btn btn-accent btn-square shadow-glow-md shadow-accent text-accent-content">
                <MdOutlineDeleteOutline size={24}/>
              </button>
            </div>
            )}
        </InstructionBase>
      </summary>
      <div className="p-4 m-2 shadow dropdown-content z-[1] bg-base-100 rounded-box w-[320px]">
        {instruction.configs?.map(config => (
                <Config
                key={`${config.field}: ${config.type}`}
                    instruction={instruction}
                    config={config}
                    setConfig={(field, value) => {
                            const newInstruction = instruction.copyWith({ [field]: value });
                            setGrid(
                            grid.replaceRule(instruction as Rule, newInstruction as Rule)
                            );
                        }}/>
            ))}
      </div>
    </details >
    );
});
