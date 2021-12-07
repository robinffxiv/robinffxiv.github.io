import {Buff, Buffs} from "./buffs";
import {Action} from "./actions";

export class Crafter {
    readonly lvl: number;
    readonly craftmanship: number;
    readonly control: number;
    readonly cp: number;
    readonly specialist: boolean;

    constructor(lvl: number,
                craftmanship: number,
                control: number,
                cp: number,
                specialist: boolean) {
        this.lvl = lvl;
        this.craftmanship = craftmanship;
        this.control = control;
        this.cp = cp;
        this.specialist = specialist;
    }
}

export class Recipe {
    readonly name: string
    readonly lvl: number;
    readonly durability: number;
    readonly progress: number;
    readonly quality: number;
    readonly progressDivisor: number;
    readonly qualityDivisor: number;

    constructor(name: string,
                lvl: number,
                durability: number,
                progress: number,
                quality: number,
                progressDivisor: number,
                qualityDivisor: number) {
        this.name = name;
        this.lvl = lvl;
        this.durability = durability;
        this.progress = progress;
        this.quality = quality;
        this.progressDivisor = progressDivisor
        this.qualityDivisor = qualityDivisor
    };
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
        return (this.crafter.craftmanship * 10 / this.recipe.progressDivisor) + 2;
    };

    calcQuality(n: number): number {
        return (this.iqControl() * 10 / this.recipe.qualityDivisor) + 35;
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
