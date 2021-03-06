import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualityAction} from "../qualityAction";

export class PrudentTouch extends QualityAction {
    override durabilityCost(): number {
        return 5;
    };

    override getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 25;
    };

    override isUsable(sim: Simulation): boolean {
        return !sim.hasBuff(Buff.WASTE_NOT) && !sim.hasBuff(Buff.WASTE_NOT_II) && super.isUsable(sim);
    };

    override getName(): string {
        return "Prudent Touch";
    };
}