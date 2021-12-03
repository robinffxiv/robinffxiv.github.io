import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class GreatStrides extends Action {
    override cpCost(sim: Simulation): number {
        return 32;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.GREAT_STRIDES, 3];
    }

    override getName(): string {
        return "Great Strides";
    }
}