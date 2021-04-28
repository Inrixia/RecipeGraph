import { RecipeGraph } from ".";

const recipieGraph = new RecipeGraph([
	{
		requires: {
			"oil": 30
		},
		produces: {
			"plastic": 20,
			"heavy oil": 10
		}
	},
	{
		requires: {
			"oil": 30
		},
		produces: {
			"rubber": 20,
			"heavy oil": 20
		}
	},
	{
		requires: {
			"heavy oil": 60
		},
		produces: {
			"fuel": 40
		}
	},
	{
		requires: {
			"plastic": 30,
			"fuel": 30
		},
		produces: {
			"rubber": 60
		}
	}
]);

import { inspect } from "util";

export const log = (val: unknown): void => console.log(inspect(val, false, 5, true));

log(recipieGraph.costToMake("rubber", 60));