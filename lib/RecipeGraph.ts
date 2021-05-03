import { GraphNode } from "./GraphNode";
import { Recipe, RecipeObj } from "./Recipe";
import { Resource } from "./Resource";

export type NestedArray<T> = Array<T | NestedArray<T>>
export type PathCost = { 
	cost: number, 
	regressiveRecipeEdges: Array<string>, 
	progressiveRecipeEdges: Array<string>, 
	usedResources: Array<string>,
	path: Array<string>,
	id?: number
};
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

	public costToMake = (resource: string, amountWanted: number): NestedArray<PathCost> | PathCost => {
		const startNode = this.resources[resource];
		if (startNode === undefined) throw Error("startNode does not exist!");
		
		const iteratePaths = (node: GraphNode, cost: PathCost["cost"], usedResources: Array<string> = [], regressiveRecipeEdges: PathCost["regressiveRecipeEdges"] = [], progressiveRecipeEdges: PathCost["progressiveRecipeEdges"] = [], path: PathCost["path"] = []): Array<PathCost> => {
			// if (node.regressiveEdges.length === 1) return iteratePaths(node.regressiveEdges[0].toNode, weight*node.regressiveEdges[0].weight, pathsCrossed, path);
			// else if (node.regressiveEdges.length === 0) return { weight, pathsCrossed, path };

			//path.push(node.name||"");
			if (node instanceof Recipe) {
				// for (const prog of node.progressiveEdges) {
				// 	usedResources.push(prog.toNode.name||"");
				// }
				if (node.regressiveEdges.length > 1) regressiveRecipeEdges.push(node.name||"undefined");
				if (node.progressiveEdges.length > 1) progressiveRecipeEdges.push(node.name||"undefined");
			}

			if (node.regressiveEdges.length !== 0) return node.regressiveEdges.flatMap(edge => {
				return iteratePaths(edge.toNode, cost*(edge.weight), [...usedResources], [...regressiveRecipeEdges], [...progressiveRecipeEdges], [...path]);
			});

			return [{ cost, usedResources, progressiveRecipeEdges, regressiveRecipeEdges, path }];
		};

		const validPaths = iteratePaths(startNode, amountWanted);
		for (const path1 of validPaths) {
			path1.id ??= Math.random()+Date.now();
		}
		for (const path1 of validPaths) {
			for (const path2 of validPaths) {
				if (
					path1.regressiveRecipeEdges.every(edge => path2.regressiveRecipeEdges.includes(edge))
					&&
					path2.regressiveRecipeEdges.every(edge => path1.regressiveRecipeEdges.includes(edge))
					&&
					path1.progressiveRecipeEdges.every(edge => path2.progressiveRecipeEdges.includes(edge))
					&&
					path2.progressiveRecipeEdges.every(edge => path1.progressiveRecipeEdges.includes(edge))
				) {
					path1.id = path2.id;
				}
			}
		}

		const paths: Record<string, PathCost> = {};

		for (const path of validPaths) {
			const id = path.id || "";
			if (paths[id] === undefined || path.cost > paths[id].cost) paths[id] = path;
		}

		return Object.values(paths);
	}
}