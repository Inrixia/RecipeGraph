import { GraphNode } from "./GraphNode";
import { Recipe } from "./Recipe";

export class Resource extends GraphNode {
	private production: number;

	constructor(resourceName: string) {
		super();
		this.name = resourceName;
		this.production = 0;
	}

	/**
	 * Connect output from a Recipe to this Resource.
	 * @param fromRecipe Recipe that makes this resource.
	 * @param amountProduced Amount of this Resource `fromRecipe` produces. 
	 */
	public connectIngress(fromRecipe: Recipe, amountProduced: number): void {
		fromRecipe.connectToNode(this, this.avalible/amountProduced);
	}

	public get avalible(): number {
		return this.production+1;
	}

	public setProduction = (production: number): number => this.production = production;
}