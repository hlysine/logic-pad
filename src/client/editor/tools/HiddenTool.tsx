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
      order={19}
      hotkey="shift+3"
      defaultHidden={true}
      sample={sample}
      component={HiddenSymbol}
      onNewSymbol={symbol => {
        return symbol as HiddenSymbolData;
      }}
    />
  );
});
