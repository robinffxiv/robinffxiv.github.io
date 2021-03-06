import {Simulation} from "../../simulation";
import {QualityAction} from "../qualityAction";

export class BasicTouch extends QualityAction {
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