import {Simulation} from "../../simulation";
import {QualAction} from "../qualAction";

export class BasicTouch extends QualAction {
    override getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override getName(): string {
        return "Basic Touch";
    }
}