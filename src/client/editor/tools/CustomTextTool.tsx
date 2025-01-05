import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/customTextSymbol.js';
import CustomTextSymbol from '../../symbols/CustomTextSymbol';

const sample = instance;

export default memo(function CustomTextTool() {
  return (
    <SymbolTool
      name="Custom Text"
      order={14}
      hotkey="9"
      sample={sample}
      component={CustomTextSymbol}
    />
  );
});
