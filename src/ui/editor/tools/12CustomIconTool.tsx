import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import CustomIconSymbolData from '../../../data/symbols/customIconSymbol';
import CustomIconSymbol from '../../symbols/CustomIconSymbol';
import GridData from '../../../data/grid';

const sample = new CustomIconSymbolData(
  'A *custom* symbol',
  new GridData(5, 4),
  0,
  0,
  'MdQuestionMark'
);

export default memo(function CustomIconTool() {
  return (
    <SymbolTool
      name="Custom Icon"
      sample={sample}
      component={CustomIconSymbol}
    />
  );
});
