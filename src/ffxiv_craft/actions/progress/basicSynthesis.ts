import {ProgressAction} from "../progressAction";
import {Simulation} from "../../simulation";

export class BasicSynthesis extends ProgressAction {
    override getPotency(sim: Simulation): number {
        return 120;
    };

    override getName(): string {
        return "Basic Synthesis";
    }
}