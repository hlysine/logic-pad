import { memo } from 'react';
import TileData from '../../../data/tile';
import TileConnections from '../../../data/tileConnections';
import { Rect } from 'react-konva';
import { Color } from '../../../data/primitives';

export interface TileProps {
  data: TileData;
  x: number;
  y: number;
  size: number;
  connections: TileConnections;
  blackColor: string;
  whiteColor: string;
  neutralColor: string;
}

export default memo(function Tile({
  data,
  x,
  y,
  size,
  blackColor,
  whiteColor,
  neutralColor,
}: TileProps) {
  if (!data.exists) return null;
  let color: string;
  switch (data.color) {
    case Color.Dark:
      color = blackColor;
      break;
    case Color.Light:
      color = whiteColor;
      break;
    case Color.Gray:
      color = neutralColor;
      break;
    default:
      throw new Error('Invalid color');
  }
  return (
    <Rect
      x={x * size + size * 0.05}
      y={y * size + size * 0.05}
      cornerRadius={size * 0.125}
      fill={color}
      width={size - size * 0.1}
      height={size - size * 0.1}
    ></Rect>
  );
});
