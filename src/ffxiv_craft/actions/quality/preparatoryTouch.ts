import {Simulation} from "../../simulation";
import {QualAction} from "../qualAction";

export class PreparatoryTouch extends QualAction {
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