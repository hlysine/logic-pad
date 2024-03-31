import React, {memo} from 'react';
import {cn} from '../../utils';
import DartSymbolData from "../../data/symbols/dartSymbol.ts";
import {Direction} from "../../data/primitives.ts";
import {
    HiMiniArrowLongDown,
    HiMiniArrowLongLeft,
    HiMiniArrowLongRight,
    HiMiniArrowLongUp,
} from "react-icons/hi2";

export interface DartProps {
  textClass: string;
  symbol: DartSymbolData;
}

export default memo(function DartSymbol({ textClass, symbol }: DartProps) {
    const direction = symbol.orientation;
    const arrowIcon = {
        [Direction.Up]: HiMiniArrowLongUp,
        [Direction.Left]: HiMiniArrowLongLeft,
        [Direction.Down]: HiMiniArrowLongDown,
        [Direction.Right]: HiMiniArrowLongRight,
    };
    const arrowStitch = {
        [Direction.Left]: 'top-0 mb-auto',
        [Direction.Up]: 'right-0 ml-auto',
        [Direction.Right]: 'bottom-0 mt-auto',
        [Direction.Down]: 'left-0 mr-auto',
    };
    // const numberDisplacement = '';
    const numberDisplacement = '-' + {
        [Direction.Left]: 'bottom',
        [Direction.Up]: 'left',
        [Direction.Right]: 'top',
        [Direction.Down]: 'right',
    }[direction] + '-[0.10em]';
    return (
        <div
            className={cn(
                'absolute flex justify-center items-center w-full h-full pointer-events-none',
                textClass
            )}
        >
            <span className={cn('absolute text-[0.5em]', textClass, numberDisplacement)}>
                {symbol.number}
            </span>
            <div className={cn('absolute', textClass, arrowStitch[direction], '-m-[0.10em]')}>
                {React.createElement(arrowIcon[direction], {size: '0.7em'})}
            </div>
        </div>
    );

});
