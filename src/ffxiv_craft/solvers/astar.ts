import PriorityQueue from "ts-priority-queue/src/PriorityQueue";
import {Crafter, Recipe, Simulation} from "../simulation";
import {getPossibleActions, terminal} from "../util";

export function tree(crafter: Crafter, recipe: Recipe, heurWeight: number = 1): void {

    console.log("Started process");

    const startTime = new Date().getTime();
    const frontier = new PriorityQueue({comparator: (a: SimNode, b: SimNode) => a.priority() - b.priority()});
    const initialSim: Simulation = new Simulation(recipe, crafter);
    frontier.queue(new SimNode(initialSim, heurWeight));

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
        for (const succNode of getSuccessorNodes(currNode)) {
            if (!terminal(succNode.sim) || goal_test(succNode.sim)) {
                frontier.queue(succNode);
            }
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
        console.log(opt.priority());
    }


}

class SimNode {
    readonly sim: Simulation;
    readonly heurWeight: number;
    constructor(sim: Simulation, heurWeight: number = 1) {
        this.sim = sim;
        this.heurWeight = heurWeight;
    };
    priority(): number {
        return this.cost() + heuristic(this.sim) * this.heurWeight;
    }
    cost(): number {
        return this.sim.actionsUsed.length;
    };
}

function getSuccessorNodes(simNode: SimNode): SimNode[] {
    return getPossibleActions(simNode.sim).map((a) => new SimNode(simNode.sim.apply(a), simNode.heurWeight));
}


function heuristic(sim: Simulation): number {
    const qualLeft = Math.max(sim.recipe.quality - sim.quality, 0);
    const estQualLeft = qualLeft / (sim.baseQuality() * 4);
    const progLeft = Math.max(sim.recipe.progress - sim.progress, 0);
    const estProgLeft = progLeft / (sim.baseProgress() * 4);
    const estAcsNeeded = estProgLeft + estQualLeft;
    const durNeeded = Math.floor(estAcsNeeded * 5 / sim.durability);
    return estAcsNeeded + durNeeded;
}


function goal_test(sim: Simulation): boolean {
    return sim.quality >= sim.recipe.quality && sim.progress >= sim.recipe.progress
}