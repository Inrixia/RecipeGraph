import { GraphNode } from "./GraphNode";
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
			this.connectIngress(createResource(resourceName), amountRequired);
		}
		for (const [resourceName, amountProduced] of Object.entries(recipe.produces)) {
			this.connectEgress(createResource(resourceName), amountProduced);
		}
	}

	/**
	 * Connect a Resource input.
	 * `fromResource` -> `this`
	 * @param fromResource Resource this recipe takes input from.
	 * @param amountRequired Amount of `fromResource` this recipe requires.
	 */
	public connectIngress(fromResource: Resource, amountRequired: number): void {
		fromResource.connectToNode(this, amountRequired)
	}

	/**
	 * Connect a Resource output.
	 * `this` -> `toResource`
	 * @param toResource Ressource this recipe outputs to.
	 * @param amountProduced Amount of `toResource` this recipe produces.
	 */
	 public connectEgress(toResource: Resource, amountProduced: number): void {
		toResource.connectIngress(this, amountProduced)
	}
}