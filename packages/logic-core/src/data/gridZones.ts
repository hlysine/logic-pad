import { isSameEdge } from './dataHelper.js';
import { Edge, Position } from './primitives.js';

export default class GridZones {
  public readonly edges: readonly Edge[];

  public constructor(edges?: readonly Edge[]) {
    this.edges = GridZones.deduplicateEdges(edges ?? []);
  }

  public addEdge(edge: Edge): GridZones {
    if (this.edges.some(e => isSameEdge(e, edge))) {
      return this;
    }
    return new GridZones([...this.edges, edge]);
  }

  public removeEdge(edge: Edge): GridZones {
    return new GridZones(this.edges.filter(e => !isSameEdge(e, edge)));
  }

  public hasEdge(edge: Edge): boolean {
    if (edge.x1 === edge.x2 && edge.y1 === edge.y2) return true;
    return this.edges.some(e => isSameEdge(e, edge));
  }

  public getEdgesAt({ x, y }: Position): readonly Edge[] {
    return this.edges.filter(
      e => (e.x1 === x && e.y1 === y) || (e.x2 === x && e.y2 === y)
    );
  }

  /**
   * Check if two GridZones objects are equal.
   * @param other The other GridZones object to compare to.
   * @returns Whether the two objects are equal.
   */
  public equals(other: GridZones): boolean {
    if (this.edges.length !== other.edges.length) return false;
    for (const edge of this.edges) {
      if (!other.hasEdge(edge)) return false;
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

  public insertColumn(index: number): GridZones {
    return new GridZones(
      this.edges.map(edge => {
        if (edge.x1 < index || edge.x2 < index) {
          return edge;
        } else {
          return { x1: edge.x1 + 1, y1: edge.y1, x2: edge.x2 + 1, y2: edge.y2 };
        }
      })
    );
  }

  public insertRow(index: number): GridZones {
    return new GridZones(
      this.edges.map(edge => {
        if (edge.y1 < index || edge.y2 < index) {
          return edge;
        } else {
          return { x1: edge.x1, y1: edge.y1 + 1, x2: edge.x2, y2: edge.y2 + 1 };
        }
      })
    );
  }

  public removeColumn(index: number): GridZones {
    return new GridZones(
      this.edges.map(edge => {
        if (edge.x1 > index || edge.x2 > index) {
          return { x1: edge.x1 - 1, y1: edge.y1, x2: edge.x2 - 1, y2: edge.y2 };
        } else {
          return edge;
        }
      })
    );
  }

  public removeRow(index: number): GridZones {
    return new GridZones(
      this.edges.map(edge => {
        if (edge.y1 > index || edge.y2 > index) {
          return { x1: edge.x1, y1: edge.y1 - 1, x2: edge.x2, y2: edge.y2 - 1 };
        } else {
          return edge;
        }
      })
    );
  }
}
