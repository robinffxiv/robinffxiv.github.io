import {ProgressAction} from "../progressAction";
import {Simulation} from "../../simulation";

export class CarefulSynthesis extends ProgressAction {
    override getPotency(sim: Simulation): number {
        return 180;
    };

    override cpCost(sim: Simulation): number {
        return 7;
    };

    override getName(): string {
        return "Careful Synthesis";
    }
}