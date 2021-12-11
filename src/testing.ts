import axios from "axios";
import {Action, Crafter, Recipe, Simulation} from "./ffxiv_craft";
import {tree} from "./ffxiv_craft/solvers/astar";
import {listToActions} from "./ffxiv_craft/util";
import do_ea from "./ffxiv_craft/solvers/evo";


export default async function testing_main() {
    const crafter: Crafter = Crafter.create({lvl: 90, craftmanship: 3166, control: 2988, cp: 484});
    const recipe: Recipe = await searchForRecipe("Integral Grinding Wheel");
    const sim: Simulation = new Simulation(recipe, crafter);

    const actions = ["Muscle Memory",
        "Groundwork",
        "Groundwork",
        "Waste Not II",
        "Manipulation",
        "Innovation",
        "Preparatory Touch",
        "Preparatory Touch",
        "Preparatory Touch",
        "Preparatory Touch",
        "Preparatory Touch",
        "Byregot's Blessing",
        "Basic Synthesis"];
    // printDebug(sim, actions);
    const heurWeight = 5;
    console.log(heurWeight);
    // tree(crafter, recipe, heurWeight);
    do_ea(crafter, recipe);
}

async function searchForRecipe(keyword: string): Promise<Recipe> {
    const baseURL = "https://xivapi.com";
    let recipeURL, data;
    const r1 = await axios.get(baseURL + "/search?indexes=recipe&string=" + keyword)
    try {
        recipeURL = r1.data["Results"][0]["Url"];
        const r2 = await axios.get(baseURL + recipeURL)
        console.log(baseURL + recipeURL);
        data = r2.data;
        const rlt = data["RecipeLevelTable"]
        return Recipe.create({name: data["Name"],
            rlvl: data["RecipeLevelTableTargetID"],
            durability: rlt["Durability"],
            progress: rlt["Difficulty"],
            quality: rlt["Quality"],
            progressDivisor: rlt["ProgressDivider"],
            qualityDivisor: rlt["QualityDivider"],
            progressModifier: rlt["ProgressModifier"],
            qualityModifier: rlt["QualityModifier"]});
    }
    catch (e) {
        return Recipe.create({});
    }
}

function printDebug(sim: Simulation, actions: string[]): void {
    const acs: Action[] = listToActions(actions);

    console.log(sim.printStatus());
    for (const a of acs) {
        a.apply(sim);
        console.log(sim.printStatus());
    }

}