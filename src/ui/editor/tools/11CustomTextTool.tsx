import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import CustomTextSymbolData from '../../../data/symbols/customTextSymbol';
import CustomTextSymbol from '../../symbols/CustomTextSymbol';
import GridData from '../../../data/grid';

const sample = new CustomTextSymbolData(
  'A *custom* symbol',
  new GridData(5, 4),
  0,
  0,
  'X'
);

export default memo(function CustomTextTool() {
  return (
    <SymbolTool
      name="Custom Text"
      sample={sample}
      component={CustomTextSymbol}
    />
  );
});
