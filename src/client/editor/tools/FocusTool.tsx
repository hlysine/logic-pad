import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/focusSymbol';
import FocusSymbol from '../../symbols/FocusSymbol';

const sample = instance;

export default memo(function FocusTool() {
  return (
    <SymbolTool
      name="Focus"
      order={202}
      hotkey="alt+2"
      defaultHidden={true}
      sample={sample}
      component={FocusSymbol}
    />
  );
});
