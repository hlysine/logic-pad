import { useMemo } from 'react';
import { cn } from '../../utils';
import ViewpointSymbolData from '../../data/symbols/viewpointSymbol';
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

export interface ViewpointProps {
  size: number;
  textClass: string;
  symbol: ViewpointSymbolData;
}

export default function ViewpointSymbol({
  size,
  textClass,
  symbol,
}: ViewpointProps) {
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: `${size * 0.6}px`,
    }),
    [size]
  );
  const arrowStyle = useMemo<React.CSSProperties>(
    () => ({
      margin: `${-size * 0.05}px`,
    }),
    [size]
  );
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto', textClass)} style={textStyle}>
        {symbol.number}
      </span>
      <div className="absolute mx-auto top-0 mb-auto" style={arrowStyle}>
        <FiChevronUp size={size * 0.4} />
      </div>
      <div className="absolute mx-auto bottom-0 mt-auto" style={arrowStyle}>
        <FiChevronDown size={size * 0.4} />
      </div>
      <div className="absolute my-auto left-0 mr-auto" style={arrowStyle}>
        <FiChevronLeft size={size * 0.4} />
      </div>
      <div className="absolute my-auto right-0 ml-auto" style={arrowStyle}>
        <FiChevronRight size={size * 0.4} />
      </div>
    </div>
  );
}
