import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class Innovation extends Action {
    override cpCost(sim: Simulation): number {
        return 18;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.INNOVATION, 4];
    };

    override getName(): string {
        return "Innovation";
    }
}