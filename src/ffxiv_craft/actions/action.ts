import {Simulation} from "../simulation";
import {Condition} from "../craft_util";
import {Buff, Buffs} from "../buffs";

export abstract class Action {
    boringMode: boolean;
    constructor(boringMode: boolean = true) {
        this.boringMode = boringMode;
    }
    apply(sim: Simulation): void {
        let used_dur = this.durabilityCost();
        if (sim.buffs[Buff.WASTE_NOT] > 0 || sim.buffs[Buff.WASTE_NOT_II] > 0) {used_dur /= 2;}
        const manipulated = sim.hasBuff(Buff.MANIPULATION);
        if (this.ticksBuffs()) {
            for (const b in sim.buffs) {
                if (b !== Buff.INNER_QUIET && b !== Buff.NAMELESS) {
                    sim.decrementBuff(b as Buff);
                    if (b === Buff.NAME_OF_THE_ELEMENTS && !sim.hasBuff(Buff.NAME_OF_THE_ELEMENTS)) {
                        sim.buffs[Buff.NAMELESS] = 1;
                    }
                }
            }
        }
        sim.progress = Math.min(sim.recipe.progress, sim.progress);
        sim.durability -= used_dur;
        if (sim.durability > 0 && manipulated) {
            sim.durability += 5;
        }
        sim.durability = Math.min(sim.durability, sim.recipe.durability);
        sim.cp -= this.cpCost(sim);
        sim.condition = this.next_condition(sim.condition);
        if (this.buffApplied() !== undefined) {
            const toApply = this.buffApplied() as [Buff, number];
            sim.buffs[toApply[0]] = toApply[1];
        }
        for (const b in sim.buffs) {
            if (sim.buffs[b as Buff] === 0) {
                sim.removeBuff(b as Buff);
            }
        }
        sim.actionsUsed.push(this.getName());
    };
    next_condition(c: Condition): Condition {
        if (!this.boringMode) {
            if (c === Condition.EXCELLENT) {
                return Condition.POOR;
            }
            const r = Math.random();
            if (r < .2) return Condition.GOOD;
            if (r < .24) return Condition.EXCELLENT;
            return Condition.NORMAL;
        }
        return Condition.NORMAL;
    }
    successRate(sim: Simulation): number {return 1;};
    succeeded(sim: Simulation): boolean {return Math.random() < this.successRate(sim);};
    canFail(): boolean {return false;}
    isUsable(sim: Simulation): boolean {return sim.cp >= this.cpCost(sim);};
    ticksBuffs(): boolean {return true;};
    cpCost(sim: Simulation): number {return 0;};
    durabilityCost(): number {return 0;};
    levelRequirement(): number {return 1;};
    buffApplied(): [Buff, number] | undefined {return undefined;};
    abstract getName(): string;
}