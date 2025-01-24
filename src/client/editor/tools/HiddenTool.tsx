import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import HiddenSymbolData, {
  instance,
} from '@logic-pad/core/data/symbols/hiddenSymbol';
import HiddenSymbol from '../../symbols/HiddenSymbol';

const sample = instance;

export default memo(function HiddenTool() {
  return (
    <SymbolTool
      name="Hidden"
      order={16}
      sample={sample}
      component={HiddenSymbol}
      onNewSymbol={(symbol, grid) => {
        return (symbol as HiddenSymbolData).withColor(
          grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y)).color
        );
      }}
    />
  );
});
