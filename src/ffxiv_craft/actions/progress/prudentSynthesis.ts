import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {ProgressAction} from "../progressAction";

export class PrudentSynthesis extends ProgressAction {
    override durabilityCost(): number {
        return 5;
    };

    override getPotency(sim: Simulation): number {
        return 180;
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override isUsable(sim: Simulation): boolean {
        return !sim.hasBuff(Buff.WASTE_NOT) && !sim.hasBuff(Buff.WASTE_NOT_II) && super.isUsable(sim);
    };

    override getName(): string {
        return "Prudent Synthesis";
    };
}