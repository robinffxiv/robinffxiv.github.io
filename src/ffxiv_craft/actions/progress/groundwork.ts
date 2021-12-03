import {SynthAction} from "../synthAction";
import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";

export class Groundwork extends SynthAction {
    override getPotency(sim: Simulation): number {
        if (sim.hasBuff(Buff.WASTE_NOT) || sim.hasBuff(Buff.WASTE_NOT_II)) {
            return sim.durability >= this.durabilityCost() / 2 ? 300 : 150;
        }
        return sim.durability >= this.durabilityCost() ? 300 : 150;
    };

    override durabilityCost(): number {
        return 20;
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override getName(): string {
        return "Groundwork";
    }
}