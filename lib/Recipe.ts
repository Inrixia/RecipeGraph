import { GraphNode } from "./Node";
import { Resource } from "./Resource";

export type RecipeObj = { requires: Record<string, number>; produces: Record<string, number>; }
export class Recipe extends GraphNode {
	constructor(recipe: RecipeObj, createResource: (resourceName: string) => Resource) {
		super();
		const requiresTitle = Object.entries(recipe.requires)
			.map(material => `${material[1]} ${material[0]}`)
			.join(" + ");
		const producesTitle = Object.entries(recipe.produces)
			.map(material => `${material[1]} ${material[0]}`)
			.join(" + ");

		this.name = `${requiresTitle} >> ${producesTitle}`;

		for (const [resourceName, amountRequired] of Object.entries(recipe.requires)) {
			createResource(resourceName).connectToNode(this, amountRequired);
		}
		for (const [resourceName, amountProduced] of Object.entries(recipe.produces)) {
			this.connectToNode(createResource(resourceName), amountProduced);
		}
	}

	public connectToNode(toNode: Resource, weight: number): void {
		super.connectToNode(toNode, toNode.avalible/weight);
	}
}