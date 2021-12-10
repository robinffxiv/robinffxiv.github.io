import {Action, possibleActions} from "./actions";
import {Simulation} from "./simulation";

export function strToAction(o: string): Action {
    return possibleActions.filter((a) => a.getName() === o)[0];
}

export function listToActions(acs: string[]): Action[] {
    return acs.map((s) => strToAction(s));
}

export function applyActions(sim: Simulation, acs: string[]): Simulation {
    for (const ac of listToActions(acs)) {
        if (ac.isUsable(sim) && !terminal(sim)) {ac.apply(sim);}
        else {break;}
    }
    return sim;
}

export function randomActionName(): string {
    return possibleActions[randInt(possibleActions.length)].getName();
}

export function randomActionNameSeq(maxLen: number): string[] {
    const len = randInt(maxLen + 1);
    const seq: string[] = [];
    for (let i = 0; i < len; i++) {
        seq.push(randomActionName());
    }
    return seq;
}

export function terminal(sim: Simulation): boolean {
    return sim.durability <= 0 || sim.progress >= sim.recipe.progress;
}

export function getPossibleActions(sim: Simulation): Action[] {
    if (terminal(sim)) {return [];}
    return possibleActions.filter(a => a.isUsable(sim));
}

export function randInt(maxExcl: number): number {
    return Math.floor(Math.random() * maxExcl);
}

export function randomRollout(sim: Simulation): Simulation {
    const newSim = sim.clone();
    while (!terminal(newSim)) {
        const possAcs: Action[] = getPossibleActions(newSim);
        possAcs[randInt(possAcs.length)].apply(newSim);
    }
    return newSim;
}
