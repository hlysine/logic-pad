import { Edge, Position } from './primitives';
import TileConnections from './tileConnections';

function isSameEdge(a: Edge, b: Edge): boolean {
  return (
    (a.x1 === b.x1 && a.y1 === b.y1 && a.x2 === b.x2 && a.y2 === b.y2) ||
    (a.x1 === b.x2 && a.y1 === b.y2 && a.x2 === b.x1 && a.y2 === b.y1)
  );
}

export default class GridConnections {
  public readonly edges: readonly Edge[];

  public constructor(edges?: readonly Edge[]) {
    this.edges = GridConnections.deduplicateEdges(edges ?? []);
  }

  public addEdge(edge: Edge): GridConnections {
    if (this.edges.some(e => isSameEdge(e, edge))) {
      return this;
    }
    return new GridConnections([...this.edges, edge]);
  }

  public removeEdge(edge: Edge): GridConnections {
    return new GridConnections(this.edges.filter(e => !isSameEdge(e, edge)));
  }

  public isConnected(edge: Edge): boolean {
    return this.edges.some(e => isSameEdge(e, edge));
  }

  public getConnectionsAt({ x, y }: Position): readonly Edge[] {
    return this.edges.filter(
      e => (e.x1 === x && e.y1 === y) || (e.x2 === x && e.y2 === y)
    );
  }

  public getForTile({ x, y }: Position): TileConnections {
    const result = new TileConnections();

    // Get all connections within 2 steps of the tile
    const edges = this.getConnectionsAt({ x, y });
    const edges2 = [
      ...edges,
      ...edges.flatMap(edge => {
        if (edge.x1 === x && edge.y1 === y) {
          return this.getConnectionsAt({ x: edge.x2, y: edge.y2 });
        } else {
          return this.getConnectionsAt({ x: edge.x1, y: edge.y1 });
        }
      }),
    ];

    // Fill in the connections
    for (const edge of edges2) {
      if (edge.x1 !== x || edge.y1 !== y) {
        const offsetX = edge.x1 - x;
        const offsetY = edge.y1 - y;
        if (offsetX >= -1 && offsetX <= 1 && offsetY >= -1 && offsetY <= 1) {
          result[offsetY][offsetX] = true;
        }
      }
      if (edge.x2 !== x || edge.y2 !== y) {
        const offsetX = edge.x2 - x;
        const offsetY = edge.y2 - y;
        if (offsetX >= -1 && offsetX <= 1 && offsetY >= -1 && offsetY <= 1) {
          result[offsetY][offsetX] = true;
        }
      }
    }

    // Fix the center and corner connections
    result.center = true;
    if (!result.top || !result.left) {
      result.topLeft = false;
    }
    if (!result.top || !result.right) {
      result.topRight = false;
    }
    if (!result.bottom || !result.left) {
      result.bottomLeft = false;
    }
    if (!result.bottom || !result.right) {
      result.bottomRight = false;
    }
    return result;
  }

  public getConnectedTiles({ x, y }: Position): readonly Position[] {
    const result: Position[] = [];
    const visited = new Set<string>();
    const queue: Position[] = [{ x, y }];
    while (queue.length > 0) {
      const current = queue.pop()!;
      if (visited.has(`${current.x},${current.y}`)) {
        continue;
      }
      visited.add(`${current.x},${current.y}`);
      result.push(current);
      const edges = this.getConnectionsAt(current);
      for (const edge of edges) {
        if (edge.x1 === current.x && edge.y1 === current.y) {
          queue.push({ x: edge.x2, y: edge.y2 });
        } else {
          queue.push({ x: edge.x1, y: edge.y1 });
        }
      }
    }
    return result;
  }

  /**
   * Create new GridConnections from a string array.
   *
   * - Use `.` for cells that don't connect to anything.
   * - Use any other character for cells that connect to the same character.
   *
   * @param array - The string array to create the connections from.
   * @returns The created connections. You can apply this to a GridData object using GridData.withConnections.
   */
  public static create(array: string[]): GridConnections {
    const edges: Edge[] = [];
    for (let y = 0; y < array.length; y++) {
      for (let x = 0; x < array[y].length; x++) {
        if (array[y][x] === '.') {
          continue;
        }
        if (x > 0 && array[y][x - 1] === array[y][x]) {
          edges.push({ x1: x - 1, y1: y, x2: x, y2: y });
        }
        if (y > 0 && array[y - 1][x] === array[y][x]) {
          edges.push({ x1: x, y1: y - 1, x2: x, y2: y });
        }
      }
    }
    return new GridConnections(edges);
  }

  /**
   * Check if two GridConnections objects are equal.
   * @param other The other GridConnections object to compare to.
   * @returns Whether the two objects are equal.
   */
  public equals(other: GridConnections): boolean {
    if (this.edges.length !== other.edges.length) return false;
    for (const edge of this.edges) {
      if (!other.isConnected(edge)) return false;
    }
    return true;
  }

  /**
   * Deduplicate an array of edges.
   * @param edges The array of edges to deduplicate.
   * @returns The deduplicated array of edges.
   */
  public static deduplicateEdges(edges: readonly Edge[]): readonly Edge[] {
    return edges.filter(
      (edge, index) => edges.findIndex(e => isSameEdge(e, edge)) === index
    );
  }
}
