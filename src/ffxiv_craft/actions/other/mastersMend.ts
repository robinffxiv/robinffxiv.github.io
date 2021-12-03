import {Simulation} from "../../simulation";
import {Action} from "../action";

export class MastersMend extends Action {
    override cpCost(sim: Simulation): number {
        return 88;
    };

    override durabilityCost(): number {
        return -30;
    };

    override getName(): string {
        return "Master's Mend";
    }
}