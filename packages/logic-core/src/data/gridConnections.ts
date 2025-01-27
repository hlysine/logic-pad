import { isSameEdge } from './dataHelper.js';
import { Edge, Position } from './primitives.js';
import TileConnections from './tileConnections.js';

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
    if (edge.x1 === edge.x2 && edge.y1 === edge.y2) return true;
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

  public insertColumn(index: number): GridConnections {
    return new GridConnections(
      this.edges.flatMap(edge => {
        if (
          (edge.x1 < index && edge.x2 < index) ||
          (edge.x1 >= index && edge.x2 >= index)
        ) {
          if (edge.x1 < index) {
            return [edge];
          }
          return [
            { x1: edge.x1 + 1, y1: edge.y1, x2: edge.x2 + 1, y2: edge.y2 },
          ];
        }
        return [
          { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 },
          { x1: edge.x1 + 1, y1: edge.y1, x2: edge.x2 + 1, y2: edge.y2 },
        ];
      })
    );
  }

  public insertRow(index: number): GridConnections {
    return new GridConnections(
      this.edges.flatMap(edge => {
        if (
          (edge.y1 < index && edge.y2 < index) ||
          (edge.y1 >= index && edge.y2 >= index)
        ) {
          if (edge.y1 < index) {
            return [edge];
          }
          return [
            { x1: edge.x1, y1: edge.y1 + 1, x2: edge.x2, y2: edge.y2 + 1 },
          ];
        }
        return [
          { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 },
          { x1: edge.x1, y1: edge.y1 + 1, x2: edge.x2, y2: edge.y2 + 1 },
        ];
      })
    );
  }

  public removeColumn(index: number): GridConnections {
    const toProcess = new Map<number, Edge[]>();
    const toKeep: Edge[] = [];
    this.edges.forEach(edge => {
      if (
        (edge.x1 < index && edge.x2 < index) ||
        (edge.x1 > index && edge.x2 > index)
      ) {
        if (edge.x1 < index) {
          toKeep.push(edge);
        } else {
          toKeep.push({
            x1: edge.x1 - 1,
            y1: edge.y1,
            x2: edge.x2 - 1,
            y2: edge.y2,
          });
        }
      } else if (edge.x1 !== index && edge.x2 !== index) {
        toKeep.push({
          x1: edge.x1 > index ? edge.x1 - 1 : edge.x1,
          y1: edge.y1,
          x2: edge.x2 > index ? edge.x2 - 1 : edge.x2,
          y2: edge.y2,
        });
      } else {
        if (edge.x1 === index) {
          if (!toProcess.has(edge.y1)) {
            toProcess.set(edge.y1, [edge]);
          } else {
            toProcess.get(edge.y1)!.push(edge);
          }
        } else if (edge.x2 === index) {
          if (!toProcess.has(edge.y2)) {
            toProcess.set(edge.y2, [edge]);
          } else {
            toProcess.get(edge.y2)!.push(edge);
          }
        }
      }
    });
    for (const [key, list] of toProcess.entries()) {
      for (let i = 1; i < list.length; i++) {
        if (!isSameEdge(list[i], list[i - 1])) {
          let x1, y1, x2, y2;
          if (list[i].x1 === index && list[i].y1 === key) {
            x1 = list[i].x2 > index ? list[i].x2 - 1 : list[i].x2;
            y1 = list[i].y2;
          } else {
            x1 = list[i].x1 > index ? list[i].x1 - 1 : list[i].x1;
            y1 = list[i].y1;
          }
          if (list[i - 1].x1 === index && list[i - 1].y1 === key) {
            x2 = list[i - 1].x2 > index ? list[i - 1].x2 - 1 : list[i - 1].x2;
            y2 = list[i - 1].y2;
          } else {
            x2 = list[i - 1].x1 > index ? list[i - 1].x1 - 1 : list[i - 1].x1;
            y2 = list[i - 1].y1;
          }
          toKeep.push({ x1, y1, x2, y2 });
        }
      }
    }
    return new GridConnections(toKeep);
  }

  public removeRow(index: number): GridConnections {
    const toProcess = new Map<number, Edge[]>();
    const toKeep: Edge[] = [];
    this.edges.forEach(edge => {
      if (
        (edge.y1 < index && edge.y2 < index) ||
        (edge.y1 > index && edge.y2 > index)
      ) {
        if (edge.y1 < index) {
          toKeep.push(edge);
        } else {
          toKeep.push({
            x1: edge.x1,
            y1: edge.y1 - 1,
            x2: edge.x2,
            y2: edge.y2 - 1,
          });
        }
      } else if (edge.y1 !== index && edge.y2 !== index) {
        toKeep.push({
          x1: edge.x1,
          y1: edge.y1 > index ? edge.y1 - 1 : edge.y1,
          x2: edge.x2,
          y2: edge.y2 > index ? edge.y2 - 1 : edge.y2,
        });
      } else {
        if (edge.y1 === index) {
          if (!toProcess.has(edge.x1)) {
            toProcess.set(edge.x1, [edge]);
          } else {
            toProcess.get(edge.x1)!.push(edge);
          }
        } else if (edge.y2 === index) {
          if (!toProcess.has(edge.x2)) {
            toProcess.set(edge.x2, [edge]);
          } else {
            toProcess.get(edge.x2)!.push(edge);
          }
        }
      }
    });
    for (const [key, list] of toProcess.entries()) {
      for (let i = 1; i < list.length; i++) {
        if (!isSameEdge(list[i], list[i - 1])) {
          let x1, y1, x2, y2;
          if (list[i].y1 === index && list[i].x1 === key) {
            x1 = list[i].x2;
            y1 = list[i].y2 > index ? list[i].y2 - 1 : list[i].y2;
          } else {
            x1 = list[i].x1;
            y1 = list[i].y1 > index ? list[i].y1 - 1 : list[i].y1;
          }
          if (list[i - 1].y1 === index && list[i - 1].x1 === key) {
            x2 = list[i - 1].x2;
            y2 = list[i - 1].y2 > index ? list[i - 1].y2 - 1 : list[i - 1].y2;
          } else {
            x2 = list[i - 1].x1;
            y2 = list[i - 1].y1 > index ? list[i - 1].y1 - 1 : list[i - 1].y1;
          }
          toKeep.push({ x1, y1, x2, y2 });
        }
      }
    }
    return new GridConnections(toKeep);
  }
}
