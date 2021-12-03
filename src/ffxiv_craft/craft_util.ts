import condition from "./magic_constants/condition";
import levelMod from "./magic_constants/levelMod";
import recipeLevel from "./magic_constants/recipeLevel";
import crafter from "./magic_constants/crafter";

export const enum CType {
    PROG = "PROGRESS", QUAL = "QUALITY"
}

export const enum Condition {
    POOR = "Poor", NORMAL = "Normal", GOOD = "Good", EXCELLENT = "Excellent"
}

//const crafter = csv_rd_parse('./magic_constants/Crafter.csv');
//const itemlevel = csv_rd_parse('./magic_constants/ItemLevel.csv');

export function lvlToCLvl(lvl: number): number {
    return crafter[lvl - 1]["CLVL"];
}

export function rlvl_craftsmanship(rlvl: number): number {
    return recipeLevel[rlvl_col(rlvl)]["CRAFTS"];
}

export function rlvl_control(rlvl: number): number {
    return recipeLevel[rlvl_col(rlvl)]["CONTROL"];
}

export function lvlmod(lvl_diff: number, type: CType): number {
    if (lvl_diff < -30) lvl_diff = -30;
    if (lvl_diff >  20) lvl_diff =  20;
    return levelMod[lvl_diff + 30][type];
}

export function cond_mod(cond: Condition): number {
    return condition[cond] / 100;
}

export function rlvl_dur(rlvl: number): number {
    return recipeLevel[rlvl_col(rlvl)]["DURABILITY"];
}

export function rlvl_prog(rlvl: number): number {
    return recipeLevel[rlvl_col(rlvl)]["PROGRESS"];
}

export function rlvl_qual(rlvl: number): number {
    return recipeLevel[rlvl_col(rlvl)]["QUALITY"];
}

function rlvl_col(rlvl: number) {
    for (let i = 0; i < recipeLevel.length; i++) {
        if (recipeLevel[i]["RLVL"] === rlvl) {
            return i;
        }
    }
    return -1;
}
