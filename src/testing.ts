import axios from "axios";
import {Crafter, Recipe, Simulation} from "./ffxiv_craft";
import {tree} from "./ffxiv_craft/solvers/astar";
import {MuscleMemory} from "./ffxiv_craft/actions/progress/muscleMemory";
import {Innovation} from "./ffxiv_craft/actions/buff/innovation";
import {DelicateSynthesis} from "./ffxiv_craft/actions/other/delicateSynthesis";
import {PreparatoryTouch} from "./ffxiv_craft/actions/quality/preparatoryTouch";
import {ByregotsBlessing} from "./ffxiv_craft/actions/quality/byregotsBlessing";


export default async function testing_main() {
    const crafter: Crafter = Crafter.create({lvl: 90, craftmanship: 3499, control: 2500, cp: 569});
    const recipe: Recipe = await searchForRecipe("Dwarven Mythril File");
    const sim = new Simulation(recipe, crafter);

    const acs = [new MuscleMemory(), new Innovation(), new DelicateSynthesis(), new PreparatoryTouch(), new PreparatoryTouch(), new ByregotsBlessing(), new DelicateSynthesis()];

    for (const ac of acs) {
        ac.apply(sim);
        console.log(sim.printStatus());
    }

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