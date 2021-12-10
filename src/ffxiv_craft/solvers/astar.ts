import PriorityQueue from "ts-priority-queue/src/PriorityQueue";
import {Crafter, Recipe, Simulation} from "../simulation";
import {getPossibleActions} from "../util";

export function tree(crafter: Crafter, recipe: Recipe): void {

    console.log("Started process");

    const startTime = new Date().getTime();
    const frontier = new PriorityQueue({comparator: (a: SimNode, b: SimNode) => a.priority() - b.priority()});
    const initialSim: Simulation = new Simulation(recipe, crafter);
    frontier.queue(new SimNode(initialSim));

    let iter: number = 0;
    let opt: SimNode | undefined = undefined;
    while (true) {

        if (frontier.length === 0) {
            break;
        }

        const currNode: SimNode = frontier.dequeue();

        iter += 1;
        if (iter % 20000 === 0) {
            console.log("Iteration " + iter + " - frontier size " + frontier.length);
            console.log(currNode.sim.printStatus());
            console.log(currNode.priority());
        }

        if (goal_test(currNode.sim)) {
            opt = currNode;
            break;
        }
        for (const succNode of getSuccessorNodes(currNode.sim)) {
            frontier.queue(succNode);
        }

    }

    console.log("Ended at iteration " + iter);
    console.log(((new Date().getTime() - startTime) / 1000) + " seconds");
    console.log("Solution: ");
    if (opt === undefined) {
        console.log("N/A")
    }
    else {
        console.log(opt.sim.printStatus());
    }


}

class SimNode {
    readonly sim: Simulation;
    constructor(sim: Simulation) {
        this.sim = sim;
    };
    priority(): number {
        return this.cost() + heuristic(this.sim);
    }
    cost(): number {
        return this.sim.actionsUsed.length;
    };
}

function getSuccessorNodes(sim: Simulation): SimNode[] {
    return getPossibleActions(sim).map((a) => new SimNode(sim.apply(a)));
}


function heuristic(sim: Simulation): number {
    const qualLeft = sim.recipe.quality - sim.quality;
    const estQualLeft = qualLeft / sim.baseQuality() / 600;
    const progLeft = sim.recipe.progress - sim.progress;
    const estProgLeft = progLeft / sim.baseProgress() / 600;
    const estAcsNeeded = estProgLeft + estQualLeft;
    const durNeeded = Math.floor(estAcsNeeded * 5 / sim.durability);
    return estAcsNeeded + durNeeded;
}


function goal_test(sim: Simulation): boolean {
    return sim.quality >= sim.recipe.quality && sim.progress >= sim.recipe.progress
}