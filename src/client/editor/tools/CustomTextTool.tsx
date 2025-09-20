import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/customTextSymbol';
import CustomTextSymbol from '../../symbols/CustomTextSymbol';

const sample = instance;

export default memo(function CustomTextTool() {
  return (
    <SymbolTool
      name="Custom Text"
      order={301}
      hotkey="extraSymbols-2"
      defaultHidden={true}
      sample={sample}
      component={CustomTextSymbol}
    />
  );
});
