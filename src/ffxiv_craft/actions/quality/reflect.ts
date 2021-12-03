import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualAction} from "../qualAction";

export class Reflect extends QualAction {
    override getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 24;
    };

    override isUsable(sim: Simulation): boolean {
        return sim.actionsUsed.length === 0 && super.isUsable(sim);
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.INNER_QUIET, 3];
    };

    override getName(): string {
        return "Reflect";
    }
}