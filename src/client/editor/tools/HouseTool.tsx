import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/houseSymbol';
import HouseSymbol from '../../symbols/HouseSymbol';

const sample = instance;

export default memo(function HouseTool() {
  return (
    <SymbolTool
      name="House"
      order={203}
      hotkey="extraSymbols-2"
      defaultHidden={true}
      sample={sample}
      component={HouseSymbol}
    />
  );
});
