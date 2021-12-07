import {Action, Crafter, possibleActions, Recipe, Simulation} from "./ffxiv_craft";
import axios from "axios";

export default async function testing_main() {
    await do_ea();
}


async function do_ea() {
    const popSize: number = 100;
    const keepBestNum: number = 50;
    const numPops = 10;

    const startTime = new Date().getTime();

    const crafter = Crafter.create({lvl: 90, craftmanship: 2958, control: 1150, cp: 569});
    const recipe = await searchForRecipe("Dwarven Mythril Pikenstock")
    if (recipe.name === "") {
        console.log("Couldn't find recipe");
        return;
    }
    console.log(recipe);
    const initialState: Simulation = new Simulation(recipe, crafter);

    let multiPops: Simulation[][] = [];
    for (let n = 0; n < numPops; n++) {
        let population: Simulation[] = [];
        while (population.length < popSize) {
            population.push(randomRollout(initialState.clone()));
        }
        multiPops.push(population);
    }

    console.log("Initialization done");

    let itersDone = 0;

    let crossProb = 0.6;
    let mutProb = 0.8;

    let lastBestFitness: number = -9999999;
    let stuckCount: number = 0;
    const maxStuck: number = 50;

    // Go until we time out or break (by reaching the goal)
    while (new Date().getTime() - startTime < 1000 * 600) {

        // Sort individuals by fitness and drop the worst ones
        for (let n = 0; n < numPops; n++) {
            let population = multiPops[n];
            population.sort((a, b) => fitness(b) - fitness(a));
            multiPops[n] = population.slice(0, keepBestNum);
        }

        // Log the best individual to track progress
        const bestSims: Simulation[] = multiPops.map((pop) => pop[0]);
        bestSims.sort((a, b) => fitness(b) - fitness(a));
        const bestSim: Simulation = bestSims[0];
        if (bestSim.quality >= initialState.recipe.quality && bestSim.progress >= initialState.recipe.progress) {
            // break;
        }
        console.log(bestSim.printStatus() + "Fitness: " + fitness(bestSim));
        // console.log(bestSims.map((s) => fitness(s)));

        if (fitness(bestSim) === lastBestFitness) {stuckCount++;}
        else {lastBestFitness = fitness(bestSim); stuckCount = 0;}

        // If we're stuck (best fitness hasn't improved for many rounds)
        /*if (stuckCount >= maxStuck) {
            console.log("Got stuck")
            // Cross over populations by shuffling them up!
            let allSims: Simulation[] = multiPops.flat();
            allSims = allSims
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            for (let i = 0; i < numPops; i++) {
                multiPops[i] = allSims.slice(i * keepBestNum, (i + 1) * keepBestNum);
            }
            stuckCount = 0;
        }*/

        // Iterate through populations and spawn new offspring for them
        for (let n = 0; n < numPops; n++) {
            let population = multiPops[n];
            let offspring: Simulation[] = [];
            while (population.length + offspring.length < popSize) {
                offspring = offspring.concat(spawn(initialState, population, crossProb, mutProb));
                /*population = population
                    .map((value) => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value);*/
            }
            multiPops[n] = population.concat(offspring);
        }
        itersDone++;
    }

    console.log("Iters done: " + itersDone);
    console.log("Final result:")
    console.log("Time elapsed: " + (new Date().getTime() - startTime) / 1000)

    const bestSims: Simulation[] = multiPops.map((pop) => pop[0]);
    bestSims.sort((a, b) => fitness(b) - fitness(a));
    const bestSim = bestSims[0];
    console.log(bestSim.printStatus());
}

function cleanUseless(sim: Simulation, ini: Simulation): Simulation {
    let acs: string[] = [...sim.actionsUsed];
    let fit: number = fitness(applyActions(ini.clone(), acs));
    let i = 0;
    while (i < acs.length) {
        const acs_minus: string[] = acs.slice(0, i).concat(acs.slice(i + 1));
        const fit_minus: number = fitness(applyActions(ini.clone(), acs_minus))
        if (fit_minus >= fit) {
            acs = acs_minus;
            fit = fit_minus;
        }
        else {
            i++;
        }
    }
    return applyActions(ini.clone(), acs);

}

function spawn(initialState: Simulation, pop: Simulation[], crossProb: number, mutProb: number): Simulation[] {
    let offspring: string[][] = pop.map((s) => [...s.actionsUsed]);
    offspring = crossover(offspring, crossProb);
    offspring = mutate(offspring, mutProb);
    return offspring.map((acs) => applyActions(initialState.clone(), acs));
}

function crossover(pop: any[][], crossProb: number): any[][] {
    const newPop: any[][] = pop;
    for (let i = 1; i < pop.length; i++) {
        if (Math.random() < crossProb) {
            const mated = mate(pop[i - 1], pop[i]);
            newPop[i - 1] = mated[0];
            newPop[i] = mated[1];
        }
    }
    return newPop;
}

function mate(ind1: any[], ind2: any[]): [any[], any[]] {
    const maxSubSeqLength = 2;
    const seqLength1 = Math.min(ind1.length, randInt(maxSubSeqLength + 1));
    const seqLength2 = Math.min(ind2.length, randInt(maxSubSeqLength + 1));
    const end1 = ind1.length - seqLength1;
    const end2 = ind2.length - seqLength2;
    const i1 = randInt(end1 + 1);
    const i2 = randInt(end2 + 1);
    const slice1 = ind1.slice(i1, i1 + seqLength1);
    const slice2 = ind2.slice(i2, i2 + seqLength2);
    spliceArray(ind1, i1, seqLength1, slice2);
    spliceArray(ind2, i2, seqLength2, slice1);
    return [ind1, ind2];
}

function mutate(pop: any[][], mutProb: number): any[][] {
    const newPop: any[][] = [];
    for (let individual of pop) {
        if (Math.random() < mutProb) {
            individual = mutate_indiv(individual);
        }
        newPop.push(individual);
    }
    return newPop;
}

function mutate_indiv(individual: any[]): any[] {
    const maxSubSeqLength: number = 3;
    const seqLength: number = Math.min(individual.length, randInt(maxSubSeqLength + 1));
    const end: number = individual.length - seqLength;
    const i: number = randInt(end + 1);
    // @ts-ignore
    Array.prototype.splice.apply(individual, [i, seqLength].concat(randomActionSeq(seqLength)));
    return individual;
}

function randomActionName(): string {
    return possibleActions[randInt(possibleActions.length)].getName();
}

function randomActionSeq(maxLen: number): string[] {
    const len = randInt(maxLen + 1);
    const seq: string[] = [];
    for (let i = 0; i < len; i++) {
        seq.push(randomActionName());
    }
    return seq;
}

function fitness(sim: Simulation): number {
    let f = 0;
    if (!(sim.progress >=  sim.recipe.progress)) {f -= sim.recipe.quality / 4;}
    f -= Math.max(sim.quality - sim.recipe.quality, 0) * .5;
    return f + sim.quality + sim.cp - sim.actionsUsed.length * sim.calcQuality(50);
}

function randomRollout(sim: Simulation): Simulation {
    const newSim = sim.clone();
    while (!terminal(newSim)) {
        const possAcs: Action[] = getPossibleActions(newSim);
        possAcs[randInt(possAcs.length)].apply(newSim);
    }
    return newSim;
}


/*
async function bare_mcts(): Promise<void> {
    console.log("Started process");
    const crafter = new Crafter(80, 2749, 2884, 610, false);
    const recipe = new Recipe("", 480, 70, 7414, 46553, 1, 1);
    const initialSim: Simulation = new Simulation(recipe, crafter);

    let curr_state = initialSim.clone();
    let step = 0;
    while (!terminal(curr_state)) {
        let root_node = new MCTSNode(undefined, undefined);
        const startTime = new Date().getTime();
        while (new Date().getTime() - startTime < 60 * 1000) {

            let node = root_node;
            let state = curr_state.clone();

            while (!node.is_leaf()) {
                const actions: Action[] = getPossibleActions(state);
                node = node.random_child();
                state.apply(node.move as Action);
            }
            node.expand_node(state);
            node = node.random_child();
            while (!terminal(state)) {
                state = simulation_policy_child(state);
            }
            const result = state.progress >= state.recipe.progress ? state.quality : 0;
            while (node.has_parent()) {
                node.update(result);
                node = node.parent as MCTSNode;
            }

        }

        const best_node = root_node.best_child();
        curr_state = curr_state.apply(best_node.move as Action);
        step++;
        console.log("Step " + step + " complete:");
        console.log(curr_state.printStatus());
    }

}*/

function simulation_policy_child(sim: Simulation): Simulation {
    const poss: Action[] = getPossibleActions(sim);
    return sim.apply(poss[Math.floor(Math.random() * poss.length)]);
}

class MCTSNode {

    readonly move: Action | undefined;
    readonly parent: MCTSNode | undefined;
    readonly children: MCTSNode[];
    avg_qual: number;
    visits: number;

    constructor(move: Action | undefined, parent: MCTSNode | undefined) {
        this.move = move;
        this.parent = parent;
        this.children = [];
        this.avg_qual = 0;
        this.visits = 0;
    }

    expand_node(sim: Simulation) {
        if (!terminal(sim)) {
            for (const a of getPossibleActions(sim)) {
                const nc = new MCTSNode(a, this);
                this.children.push(nc);
            }
        }
    }

    update(qual: number) {
        this.visits++;
        this.avg_qual = ((this.avg_qual * (this.visits - 1)) + qual) / this.visits;
    }

    is_leaf() {
        return this.children.length <= 0;
    }

    has_parent() {
        return this.parent !== undefined;
    }

    random_child(): MCTSNode {
        return this.children[Math.floor(Math.random() * this.children.length)]
    }

    best_child(): MCTSNode {
        const max_q = Math.max(...this.children.map((c) => c.avg_qual));
        return this.children.filter((c) => c.avg_qual === max_q)[0];
    }


}

/*
export async function tree(): Promise<void> {

    console.log("Started process");

    const startTime = new Date().getTime();

    const frontier = new PriorityQueue({comparator: (a: SimNode, b: SimNode) => a.priority() - b.priority()});

    const crafter = new Crafter(80, 2749, 2884, 610, false);
    const recipe = Recipe("", 480, 70, 7414, 46553, 1, 1);
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
        if (iter % 5000 === 0) {
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


};*/

function heuristic(sim: Simulation): number {
    const qualLeft = sim.recipe.quality - sim.quality;
    const estQualLeft = qualLeft / sim.calcQuality(600);
    const progLeft = sim.recipe.progress - sim.progress;
    const estProgLeft = progLeft / sim.calcProgress(600);
    const estAcsNeeded = estProgLeft + estQualLeft;
    const durNeeded = Math.floor(estAcsNeeded * 5 / sim.durability);
    return estAcsNeeded + durNeeded;
}

function terminal(sim: Simulation): boolean {
    return sim.durability <= 0 || sim.progress >= sim.recipe.progress;
}

function goal_test(sim: Simulation): boolean {
    return sim.quality >= sim.recipe.quality && sim.progress >= sim.recipe.progress
}

function getPossibleActions(sim: Simulation): Action[] {
    if (terminal(sim)) {return [];}
    return possibleActions.filter(a => a.isUsable(sim));
}
/*
function filterAcs(sim: Simulation) {

    return function (a: Action): boolean {
        const basic = a.isUsable(sim);
        const combo = !(sim.lastAction() === new BasicTouch().getName() && a.getName() === new BasicTouch().getName())
        const redundantBuff = !((a.getName() === new Veneration().getName() && sim.hasBuff(Buff.VENERATION)) ||
            (a.getName() === new Innovation().getName() && sim.hasBuff(Buff.INNOVATION)) ||
            ((a.getName() === new WasteNot().getName() || a.getName() === new WasteNotII().getName()) &&
                ((sim.hasBuff(Buff.WASTE_NOT)) || sim.hasBuff(Buff.WASTE_NOT_II))) ||
            (a.getName() === new Manipulation().getName() && sim.hasBuff(Buff.MANIPULATION)) ||
            (a.getName() === new GreatStrides().getName() && sim.hasBuff(Buff.GREAT_STRIDES)));
        return basic && combo && redundantBuff;
    }

}


 */

function getSuccessors(sim: Simulation): Simulation[] {
    return getPossibleActions(sim).map((a) => sim.apply(a));
}

function getSuccessorNodes(sim: Simulation): SimNode[] {
    return getSuccessors(sim).map((succ) => new SimNode(succ));
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

function strToAction(o: string): Action {
    return possibleActions.filter((a) => a.getName() === o)[0];
}

function listToActions(acs: string[]): Action[] {
    return acs.map((s) => strToAction(s));
}

function applyActions(sim: Simulation, acs: string[]): Simulation {
    for (const ac of listToActions(acs)) {
        if (ac.isUsable(sim) && !terminal(sim)) {ac.apply(sim);}
        else {break;}
    }
    return sim;
}

function randInt(maxExcl: number): number {
    return Math.floor(Math.random() * maxExcl);
}

function spliceArray(array: any[], index: number, howMany: number, replacement: any[]) {
    // @ts-ignore
    Array.prototype.splice.apply(array, [index, howMany].concat(replacement));
}

async function searchForRecipe(keyword: string): Promise<Recipe> {
    const baseURL = "https://xivapi.com";
    let recipeURL, data;
    const r1 = await axios.get(baseURL + "/search?indexes=recipe&string=" + keyword)
    try {
        recipeURL = r1.data["Results"][0]["Url"];
        const r2 = await axios.get(baseURL + recipeURL)
        data = r2.data;
        const rlt = data["RecipeLevelTable"]
        return Recipe.create({name: data["Name"],
            lvl: rlt["ClassJobLevel"],
            durability: rlt["Durability"],
            progress: rlt["Difficulty"],
            quality: rlt["Quality"],
            progressDivisor: rlt["ProgressDivider"],
            qualityDivisor: rlt["QualityDivider"]});
    }
    catch (e) {
        return Recipe.create({});
    }
}