import Grid from './ui/Grid';
import GridData from './data/grid';
import { useState } from 'react';

export default function App() {
  const [grid, setGrid] = useState(new GridData(10, 10));
  return (
    <div className="h-dvh w-dvw overflow-scroll">
      <div className="flex justify-center items-center min-h-full">
        <Grid
          size={600}
          data={grid}
          onTileClick={(x, y, target) =>
            setGrid(grid => grid.setTile(x, y, t => t.withColor(target)))
          }
        />
      </div>
    </div>
  );
}
