import { GraphNode } from "./Node";
import { Recipe } from "./Recipe";

export class Resource extends GraphNode {
	private production: number;

	constructor(resourceName: string) {
		super();
		this.name = resourceName;
		this.production = 0;
	}

	public connectToNode(toNode: Recipe, weight: number): void {
		super.connectToNode(toNode, (this.production/weight)+weight);
	}

	public get avalible(): number {
		return this.production+1;
	}

	public setProduction = (production: number): number => this.production = production;
}