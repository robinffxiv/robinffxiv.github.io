import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {ProgressAction} from "../progressAction";

export class MuscleMemory extends ProgressAction {
    override getPotency(sim: Simulation): number {
        return 300;
    };

    override isUsable(sim: Simulation): boolean {
        return sim.actionsUsed.length === 0 && super.isUsable(sim);
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.MUSCLE_MEMORY, 5];
    };

    override cpCost(sim: Simulation): number {
        return 6;
    }

    override getName(): string {
        return "Muscle Memory";
    }
}