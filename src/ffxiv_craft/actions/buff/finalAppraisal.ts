import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class FinalAppraisal extends Action {
    override cpCost(sim: Simulation): number {
        return 1;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.FINAL_APPRAISAL, 5];
    };

    override ticksBuffs(): boolean {
        return false;
    };

    override getName(): string {
        return "Final Appraisal";
    }
}