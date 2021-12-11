import {Crafter, Recipe, Simulation} from "../simulation";
import {applyActions, randInt, randomActionNameSeq, randomRollout} from "../util";

export default function do_ea(crafter: Crafter, recipe: Recipe) {
    const popSize: number = 1000;
    const keepBestNum: number = 500;
    const numPops = 1;

    const startTime = new Date().getTime();

    if (recipe.name === "") {
        console.log("Couldn't find recipe");
        return;
    }
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
            break;
        }
        console.log(bestSim.printStatus(false) + "Fitness: " + fitness(bestSim));
        // console.log(bestSims.map((s) => fitness(s)));

        if (fitness(bestSim) === lastBestFitness) {stuckCount++;}
        else {lastBestFitness = fitness(bestSim); stuckCount = 0;}

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

    console.log("Generations made: " + itersDone);
    console.log("Time elapsed: " + (new Date().getTime() - startTime) / 1000)

    console.log("Final result:")

    const bestSims: Simulation[] = multiPops.map((pop) => pop[0]);
    bestSims.sort((a, b) => fitness(b) - fitness(a));
    const bestSim = bestSims[0];
    console.log(bestSim.printStatus());
    console.log("Fitness: " + fitness(bestSim));
}

function fitness(sim: Simulation): number {
    let qualBonus = sim.quality;
    if (sim.quality > sim.recipe.quality) {
        const excessQual = Math.min(sim.quality - sim.recipe.quality, sim.recipe.quality * .2);
        qualBonus = sim.recipe.quality + excessQual * .5;
    }

    let progPenalty = 0;
    if (sim.progress < sim.recipe.progress) {
        progPenalty = sim.recipe.quality * .5 + (sim.recipe.progress - sim.progress);
    }

    const actionPenalty = sim.actionsUsed.length * sim.baseQuality() / 2;

    return qualBonus - progPenalty - actionPenalty;
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
    ind1.splice(i1, seqLength1, ...slice2);
    ind2.splice(i2, seqLength2, ...slice1);
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
    const maxSubSeqLength: number = 2;
    const seqLength: number = Math.min(individual.length, randInt(maxSubSeqLength + 1));
    const i: number = randInt(individual.length - seqLength + 1);
    individual.splice(i, seqLength, ...randomActionNameSeq(seqLength));
    return individual;
}