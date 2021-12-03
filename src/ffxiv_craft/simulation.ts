import {
    cond_mod,
    Condition,
    CType,
    lvlmod,
    rlvl_control,
    rlvl_craftsmanship,
    rlvl_dur,
    rlvl_prog,
    rlvl_qual
} from "./craft_util";
import "./craft_util";
import {Buff, Buffs} from "./buffs";
import {Action} from "./actions";
import dc from "deepcopy";

export class Crafter {
    readonly clvl: number;
    readonly craftmanship: number;
    readonly control: number;
    readonly cp: number;
    readonly specialist: boolean;

    constructor(clvl: number,
                craftmanship: number,
                control: number,
                cp: number,
                specialist: boolean) {
        this.clvl = clvl;
        this.craftmanship = craftmanship;
        this.control = control;
        this.cp = cp;
        this.specialist = specialist;
    }
}

export class Recipe {
    readonly rlvl: number;
    readonly durability: number;
    readonly progress: number;
    readonly quality: number;
    readonly dFactor: number;
    readonly pFactor: number;
    readonly qFactor: number;

    constructor(rlvl: number,
                durability: number,
                progress: number,
                quality: number) {
        this.rlvl = rlvl;
        this.durability = durability;
        this.progress = progress;
        this.quality = quality;
        this.dFactor = 100;
        this.pFactor = 100;
        this.qFactor = 100;
    };
}

export class Simulation {
    readonly recipe: Recipe;
    readonly crafter: Crafter;
    cp: number;
    durability: number;
    progress: number;
    quality: number;
    condition: Condition;
    buffs: Buffs;
    actionsUsed: string[];
    boringMode: boolean;

    constructor(recipe: Recipe,
                crafter: Crafter,
                cp?: number,
                durability?: number,
                progress?: number,
                quality?: number,
                condition?: Condition,
                buffs?: Buffs,
                actionsUsed?: string[],
                boringMode?: boolean) {
        this.recipe = recipe;
        this.crafter = crafter;
        this.cp = cp === undefined ? this.crafter.cp : cp;
        this.durability = durability === undefined ? this.recipe.durability : durability;
        this.progress = progress === undefined ? 0 : progress;
        this.quality = quality === undefined ? 0 : quality;
        this.condition = condition === undefined ? Condition.NORMAL : condition;
        this.buffs = buffs === undefined ? {} as Buffs : buffs;
        this.actionsUsed = actionsUsed === undefined ? [] : actionsUsed;
        this.boringMode = boringMode === undefined ? true : boringMode;
    };
    
    clone(): Simulation {
        return new Simulation(this.recipe, this.crafter, this.cp, this.durability, this.progress,
            this.quality, this.condition, dc(this.buffs), dc(this.actionsUsed), this.boringMode);
    }
    
    apply(a: Action): Simulation {
        const newSim = this.clone();
        a.apply(newSim);
        return newSim;
    }

    printStatus(): string {
        let output = "Progress: " + this.progress +  " out of " + this.recipe.progress + "\n";
        output += "Quality: " + this.quality + " out of " + this.recipe.quality + "\n";
        output += "Durability: " + this.durability + " out of " + this.recipe.durability + "\n";
        output += "CP: " + this.cp + "\n";
        output += "Actions used: \n";
        for (const a of this.actionsUsed) {
            output += a;
            output += "\n";
        }
        for (const b in this.buffs) {
            output += b + ": " + this.buffs[b as Buff] + "\n";
        }
        return output;
    };

    calcProgress(n: number): number {
        const cms = this.crafter.craftmanship;
        const rlvl = this.recipe.rlvl;
        const lvl_diff = this.crafter.clvl - this.recipe.rlvl;
        const p1 = cms * (21 / 100) + 2;
        const p2 = p1 * (cms + 10000) / (rlvl_craftsmanship(rlvl) + 10000);
        const p3 = p2 * lvlmod(lvl_diff, CType.PROG) / 100;
        return Math.floor(Math.floor(p3) * cond_mod(this.condition) * (n / 100));
    };

    calcQuality(n: number): number {
        const iq = this.iq();
        const rlvl = this.recipe.rlvl;
        const lvl_diff = this.crafter.clvl - this.recipe.rlvl;
        const q1 = (iq * 7 / 20) + 35;
        const q2 = q1 * (iq + 10000) / (rlvl_control(rlvl) + 10000);
        const q3 = q2 * lvlmod(lvl_diff, CType.QUAL) / 100;
        return Math.floor(Math.floor(q3 * cond_mod(this.condition)) * (n / 100));
    };

    iq(): number {
        if (!this.hasBuff(Buff.INNER_QUIET)) return this.crafter.control;
        return this.crafter.control * ((this.buffs[Buff.INNER_QUIET] / 5) + 0.8);
    };

    lastAction(): string {
        return this.actionsUsed[this.actionsUsed.length - 1];
    };

    totalDurabilityFactor(): number {
        return Math.floor(rlvl_dur(this.recipe.rlvl) * this.recipe.dFactor / 100);
    };

    totalProgressFactor(): number {
        return Math.floor(rlvl_prog(this.recipe.rlvl) * this.recipe.pFactor / 100);
    };

    totalQualityFactor(): number {
        return Math.floor(rlvl_qual(this.recipe.rlvl) * this.recipe.qFactor / 100);
    };

    hasBuff(buff: Buff): boolean {
        return this.buffs[buff] !== undefined && this.buffs[buff] > 0;
    }

    removeBuff(buff: Buff): void {
        delete this.buffs[buff];
    }

    decrementBuff(buff: Buff): void {
        if (this.hasBuff(buff)) {
            if (this.buffs[buff] > 1) {this.buffs[buff] -= 1;}
            else {this.removeBuff(buff);}
        }
    }
}
