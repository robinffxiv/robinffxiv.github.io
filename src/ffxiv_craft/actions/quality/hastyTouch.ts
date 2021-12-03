import {Simulation} from "../../simulation";
import {QualAction} from "../qualAction";

export class HastyTouch extends QualAction {
    override getPotency(sim: Simulation): number {
        return 100;
    };

    override successRate(sim: Simulation): number {
        return 0.6;
    };

    canFail(): boolean {
        return true;
    }

    override getName(): string {
        return "Hasty Touch";
    }
}