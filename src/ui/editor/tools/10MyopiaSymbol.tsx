import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import MyopiaSymbolData from '../../../data/symbols/myopiaSymbol';
import MyopiaSymbol from '../../symbols/MyopiaSymbol';

const sample = new MyopiaSymbolData(0, 0, {
  up: true,
  down: false,
  left: false,
  right: true,
});

export default memo(function MyopiaTool() {
  return <SymbolTool name="Myopia" sample={sample} component={MyopiaSymbol} />;
});
