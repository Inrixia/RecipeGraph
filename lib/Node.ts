import { Edge } from "./Edge";

export class GraphNode {
	public readonly regressiveEdges: Array<Edge> = [];
	public readonly progressiveEdges: Array<Edge> = [];
	public name?: string;

	private addRegressiveEdge = (edge: Edge) => this.regressiveEdges.push(edge);
	public connectToNode(toNode: GraphNode, weight: number): void {
		this.progressiveEdges.push(new Edge(this, toNode, weight, { name: `${weight} * [${this.name}] > [${toNode.name}]` }));
		toNode.addRegressiveEdge(new Edge(toNode, this, weight, { name: `${weight} * [${this.name}] < [${toNode.name}]` }));
	}
}