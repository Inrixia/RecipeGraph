import { GraphNode } from "./GraphNode";

export type EdgeOptions = { name?: string }
export class Edge {
	public readonly fromNode: GraphNode;
	public readonly toNode: GraphNode;
	public readonly name?: string;
	public readonly weight: number;

	constructor(fromNode: GraphNode, toNode: GraphNode, weight: number, options?: EdgeOptions) {
		this.fromNode = fromNode;
		this.toNode = toNode;

		this.weight = weight;

		this.name = options?.name;
	}
}