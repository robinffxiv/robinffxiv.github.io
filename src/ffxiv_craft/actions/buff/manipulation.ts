import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class Manipulation extends Action {
    override cpCost(sim: Simulation): number {
        return 96;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.MANIPULATION, 8];
    };

    override getName(): string {
        return "Manipulation";
    }
}