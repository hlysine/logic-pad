import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/customIconSymbol';
import CustomIconSymbol from '../../symbols/CustomIconSymbol';

const sample = instance;

export default memo(function CustomIconTool() {
  return (
    <SymbolTool
      name="Custom Icon"
      sample={sample}
      component={CustomIconSymbol}
    />
  );
});
