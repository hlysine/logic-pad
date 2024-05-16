import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/myopiaSymbol';
import MyopiaSymbol from '../../symbols/MyopiaSymbol';

const sample = instance;

export default memo(function MyopiaTool() {
  return <SymbolTool name="Myopia" sample={sample} component={MyopiaSymbol} />;
});
