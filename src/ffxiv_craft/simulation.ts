import {Buff, Buffs} from "./buffs";
import {Action} from "./actions";
import {Data} from "dataclass";

export class Crafter extends Data {
    lvl: number = 1;
    craftmanship: number = 0;
    control: number = 0;
    cp: number = 0;
}

export class Recipe extends Data {
    name: string = "";
    lvl: number = 0;
    durability: number = 10;
    progress: number = 10;
    quality: number = 10;
    progressDivisor: number = 100;
    qualityDivisor: number = 100;
}

export class Simulation {
    readonly recipe: Recipe;
    readonly crafter: Crafter;
    cp: number;
    durability: number;
    progress: number;
    quality: number;
    buffs: Buffs;
    actionsUsed: string[];

    constructor(recipe: Recipe,
                crafter: Crafter,
                cp?: number,
                durability?: number,
                progress?: number,
                quality?: number,
                buffs?: Buffs,
                actionsUsed?: string[]) {
        this.recipe = recipe;
        this.crafter = crafter;
        this.cp = cp === undefined ? this.crafter.cp : cp;
        this.durability = durability === undefined ? this.recipe.durability : durability;
        this.progress = progress === undefined ? 0 : progress;
        this.quality = quality === undefined ? 0 : quality;
        this.buffs = buffs === undefined ? {} as Buffs : buffs;
        this.actionsUsed = actionsUsed === undefined ? [] : actionsUsed;
    };
    
    clone(): Simulation {
        return new Simulation(this.recipe, this.crafter, this.cp, this.durability, this.progress,
            this.quality, {...this.buffs}, [...this.actionsUsed]);
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
        return n / 100 * (this.crafter.craftmanship * 10 / this.recipe.progressDivisor) + 2;
    };

    calcQuality(n: number): number {
        return n / 100 * (this.iqControl() * 10 / this.recipe.qualityDivisor) + 35;
    };

    iqControl(): number {
        if (!this.hasBuff(Buff.INNER_QUIET)) return this.crafter.control;
        return this.crafter.control * ((this.buffs[Buff.INNER_QUIET] / 5) + 1);
    };

    lastAction(): string {
        return this.actionsUsed[this.actionsUsed.length - 1];
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
