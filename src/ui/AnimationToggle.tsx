import { memo, useState } from 'react';
import { MdAnimation } from 'react-icons/md';
import { cn, externalReducedMotion, siteOptions } from '../utils';

export default memo(function AnimationToggle() {
  const [reduceMotion, setReduceMotion] = useState(
    siteOptions.reducedMotionOverride
  );
  const toggleReduceMotion = () => {
    setReduceMotion(sa => {
      const val = !sa;
      siteOptions.reducedMotionOverride = val;
      window.localStorage.setItem('reducedMotion', String(val));
      return val;
    });
  };
  const external = externalReducedMotion();
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip={
        external
          ? 'Fancy animations are disabled by the browser'
          : 'Toggle fancy animations'
      }
    >
      <button
        className={cn(
          'btn btn-square',
          reduceMotion ? 'text-base-content/30' : 'text-base-content'
        )}
        disabled={external}
        onClick={toggleReduceMotion}
      >
        <MdAnimation size={24} />
      </button>
    </div>
  );
});
