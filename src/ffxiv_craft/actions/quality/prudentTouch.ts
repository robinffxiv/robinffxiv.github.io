import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualAction} from "../qualAction";

export class PrudentTouch extends QualAction {
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
        const wasteNot = sim.buffs[Buff.WASTE_NOT] > 0 && sim.buffs[Buff.WASTE_NOT_II] > 0;
        return !wasteNot && super.isUsable(sim);
    };

    override getName(): string {
        return "Prudent Touch";
    };
}