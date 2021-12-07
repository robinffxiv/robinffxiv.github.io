import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualityAction} from "../qualityAction";

export class Reflect extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 6;
    };

    override isUsable(sim: Simulation): boolean {
        return sim.actionsUsed.length === 0 && super.isUsable(sim);
    };

    override iqStacksAdded(): number {
        return 2;
    }

    override getName(): string {
        return "Reflect";
    }
}