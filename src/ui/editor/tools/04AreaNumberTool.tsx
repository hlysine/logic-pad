import { memo } from 'react';
import AreaNumberSymbolData from '../../../data/symbols/areaNumberSymbol';
import SymbolTool from '../SymbolTool';
import AreaNumberSymbol from '../../symbols/AreaNumberSymbol';

const sample = new AreaNumberSymbolData(0, 0, 1);

export default memo(function AreaNumberTool() {
  return (
    <SymbolTool
      name="Area Number"
      sample={sample}
      component={AreaNumberSymbol}
    />
  );
});
