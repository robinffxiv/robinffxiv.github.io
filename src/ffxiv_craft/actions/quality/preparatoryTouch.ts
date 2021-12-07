import {Simulation} from "../../simulation";
import {QualityAction} from "../qualityAction";

export class PreparatoryTouch extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 200;
    };

    override durabilityCost(): number {
        return 20;
    };

    override iqStacksAdded(): number {
        return 2;
    };

    override cpCost(sim: Simulation): number {
        return 40;
    };

    override getName(): string {
        return "Preparatory Touch";
    }
}