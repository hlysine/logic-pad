import { memo } from 'react';
import { instance } from '@logic-pad/core/data/symbols/areaNumberSymbol';
import SymbolTool from '../SymbolTool';
import AreaNumberSymbol from '../../symbols/AreaNumberSymbol';

const sample = instance;

export default memo(function AreaNumberTool() {
  return (
    <SymbolTool
      name="Area Number"
      order={6}
      hotkey="1"
      sample={sample}
      component={AreaNumberSymbol}
    />
  );
});
