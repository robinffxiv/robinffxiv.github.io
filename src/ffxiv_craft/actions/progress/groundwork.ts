import {ProgressAction} from "../progressAction";
import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";

export class Groundwork extends ProgressAction {
    override getPotency(sim: Simulation): number {
        let eff: number = 360;
        if (sim.hasBuff(Buff.WASTE_NOT) || sim.hasBuff(Buff.WASTE_NOT_II)) {eff /= 2;}
        return eff;
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