import { memo, useState } from 'react';
import { cn } from '../../utils';
import mouseContext from '../grid/MouseContext';

interface TouchOptionProps {
  selected: boolean;
  className?: string;
  children: React.ReactNode;
}

function TouchOption({ selected, className, children }: TouchOptionProps) {
  return (
    <div
      className={cn(
        'basis-10 p-3 text-center transition-all',
        selected && 'grow',
        className
      )}
    >
      {selected && children}
    </div>
  );
}

export default memo(function TouchControls() {
  const [inverted, setInverted] = useState(false);
  const onSwitch = () => {
    setInverted(i => {
      const newValue = !i;
      mouseContext.setInverted(newValue);
      return newValue;
    });
  };
  return (
    <div
      className="flex justify-stretch items-stretch shadow-md rounded-box w-full overflow-hidden z-40 cursor-pointer sticky top-2 left-2"
      onClick={onSwitch}
    >
      <TouchOption selected={!inverted} className="bg-black text-white">
        Black
      </TouchOption>
      <TouchOption selected={inverted} className="bg-white text-black">
        White
      </TouchOption>
    </div>
  );
});
