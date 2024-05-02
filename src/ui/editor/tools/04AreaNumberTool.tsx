import { memo } from 'react';
import { instance } from '../../../data/symbols/areaNumberSymbol';
import SymbolTool from '../SymbolTool';
import AreaNumberSymbol from '../../symbols/AreaNumberSymbol';

const sample = instance;

export default memo(function AreaNumberTool() {
  return (
    <SymbolTool
      name="Area Number"
      sample={sample}
      component={AreaNumberSymbol}
    />
  );
});
