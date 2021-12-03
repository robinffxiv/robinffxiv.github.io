import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class InnerQuiet extends Action {
    override cpCost(sim: Simulation): number {
        return 18;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.INNER_QUIET, 1];
    };

    override getName(): string {
        return "Inner Quiet";
    }
}