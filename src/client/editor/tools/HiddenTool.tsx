import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/hiddenSymbol';
import HiddenSymbol from '../../symbols/HiddenSymbol';

const sample = instance;

export default memo(function HiddenTool() {
  return (
    <SymbolTool
      name="Hidden"
      order={16}
      sample={sample}
      component={HiddenSymbol}
    />
  );
});
