import { GraphNode } from "./Node";
import { Recipe, RecipeObj } from "./Recipe";
import { Resource } from "./Resource";

export type NestedArray<T> = Array<T | NestedArray<T>>
export class RecipeGraph {
	public readonly recipes: Array<Recipe>;
	public readonly resources: Record<string, Resource> = {}

	constructor(recipes: Array<RecipeObj>) {
		this.recipes = recipes.map(recipe => new Recipe(recipe, this.createResource.bind(this)));
	}

	protected createResource(resourceName: string): Resource {
		if (this.resources[resourceName] !== undefined) return this.resources[resourceName];
		return this.resources[resourceName] = new Resource(resourceName);
	}

	public costToMake = (resource: string, amountWanted: number): NestedArray<number> | number => {
		const startNode = this.resources[resource];
		if (startNode === undefined) throw Error("startNode does not exist!");
		

		
		const iteratePaths = (node: GraphNode, weight: number): NestedArray<number> | number => {
			if (node.regressiveEdges.length === 1) return iteratePaths(node.regressiveEdges[0].toNode, weight*node.regressiveEdges[0].weight);
			else if (node.regressiveEdges.length === 0) return weight;

			return node.regressiveEdges.map(edge => {
				return iteratePaths(edge.toNode, weight*(edge.weight));
			});
		};

		return iteratePaths(startNode, amountWanted);
	}
}