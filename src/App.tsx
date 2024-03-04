import Grid from './ui/Grid';
import GridData from './data/grid';
import { useState } from 'react';
import NumberMarkup from './data/markups/number';

export default function App() {
  const [grid, setGrid] = useState(
    new GridData(10, 10)
      .setTile(1, 2, t => t.addMarkup(new NumberMarkup(6)))
      .withConnections(c =>
        c
          .addEdge({ x1: 1, y1: 1, x2: 1, y2: 2 })
          .addEdge({ x1: 1, y1: 2, x2: 2, y2: 2 })
          .addEdge({ x1: 2, y1: 2, x2: 2, y2: 3 })
          .addEdge({ x1: 2, y1: 3, x2: 3, y2: 3 })
          .addEdge({ x1: 3, y1: 3, x2: 3, y2: 2 })
          .addEdge({ x1: 2, y1: 2, x2: 3, y2: 2 })
          .addEdge({ x1: 0, y1: 5, x2: 1, y2: 5 })
          .addEdge({ x1: 1, y1: 5, x2: 2, y2: 5 })
          .addEdge({ x1: 2, y1: 5, x2: 3, y2: 5 })
          .addEdge({ x1: 3, y1: 5, x2: 4, y2: 5 })
          .addEdge({ x1: 4, y1: 5, x2: 5, y2: 5 })
      )
  );
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
