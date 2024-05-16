import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/customTextSymbol';
import CustomTextSymbol from '../../symbols/CustomTextSymbol';

const sample = instance;

export default memo(function CustomTextTool() {
  return (
    <SymbolTool
      name="Custom Text"
      order={13}
      sample={sample}
      component={CustomTextSymbol}
    />
  );
});
