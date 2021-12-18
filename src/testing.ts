import axios from "axios";
import {Action, Crafter, Recipe, Simulation} from "./ffxiv_craft";
import {astar} from "./ffxiv_craft/solvers/astar";
import {bfs} from "./ffxiv_craft/solvers/bfs"
import {listToActions} from "./ffxiv_craft/util";
import do_ea from "./ffxiv_craft/solvers/evo";


export default async function testing_main() {
    const crafter: Crafter = Crafter.create({lvl: 83, craftmanship: 2769, control: 2806, cp: 560});

    const rList = ["Copper Earrings",
        "Slate Whetstone",
        "Durium Ingot",
        "Stonegold Nugget",
        "Dwarven Mythril Rapier",
        "Manganese Orrery",
        "Exarchic Rod"]

    for (const recName of rList) {
        const recipe: Recipe = await searchForRecipe(recName);
        do_ea(crafter, recipe)
    }

    const killerRecipe: Recipe = Recipe.create({
        name: "Ultima Recipe",
        rlvl: 514,
        durability: 70,
        progress: 4999,
        quality: 9999,
        progressDivisor: 110,
        qualityDivisor: 90,
        progressModifier: 80,
        qualityModifier: 70
    })

    do_ea(crafter, killerRecipe)


}

async function searchForRecipe(keyword: string): Promise<Recipe> {
    const baseURL = "https://xivapi.com";
    let recipeURL, data;
    const r1 = await axios.get(baseURL + "/search?indexes=recipe&string=" + encodeURIComponent(keyword))
    console.log(baseURL + "/search?indexes=recipe&string=" + encodeURIComponent(keyword))
    try {
        recipeURL = r1.data["Results"][0]["Url"];
        const r2 = await axios.get(baseURL + recipeURL)
        console.log(baseURL + recipeURL);
        data = r2.data;
        const rlt = data["RecipeLevelTable"]
        return Recipe.create({name: data["Name"],
            rlvl: data["RecipeLevelTableTargetID"],
            durability: Math.floor(rlt["Durability"] * data["DurabilityFactor"] / 100),
            progress: Math.floor(rlt["Difficulty"] * data["DifficultyFactor"] / 100),
            quality: Math.floor(rlt["Quality"] * data["QualityFactor"] / 100),
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