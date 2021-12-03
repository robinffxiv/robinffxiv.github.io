import {Crafter, Recipe, Simulation} from "./simulation";
import {Action, possibleActions} from "./actions";

export class Simulator {

    sim: Simulation;

    constructor(recipe: Recipe, crafter: Crafter) {
        this.sim = new Simulation(recipe, crafter);
    }

    getPossibleActions(): Action[] {
        const possible: Action[] = [];
        for (const a of possibleActions) {
            if (a.isUsable(this.sim)) {
                possible.push(a);
            }
        }
        return possible;
    }

    getSuccessors(): Simulation[] {
        const possible: Simulation[] = [];
        for (const a of this.getPossibleActions()) {
            possible.push(this.sim.apply(a));
        }
        return possible;
    }


}