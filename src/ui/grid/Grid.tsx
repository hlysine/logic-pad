import { memo } from 'react';
import GridData from '../../data/grid';
import { Color } from '../../data/primitives';
import DOMGrid from './canvasGrid/Grid';

export interface GridProps {
  size: number;
  grid: GridData;
  editable: boolean;
  onTileClick?: (x: number, y: number, target: Color, flood: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export default memo(function Grid(props: GridProps) {
  return <DOMGrid {...props} />;
});
