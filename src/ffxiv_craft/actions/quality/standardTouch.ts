import {Simulation} from "../../simulation";
import {BasicTouch} from "./basicTouch";
import {QualityAction} from "../qualityAction";

export class StandardTouch extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 125;
    };

    override cpCost(sim: Simulation): number {
        return sim.lastAction() === new BasicTouch().getName() ? 18 : 32;
    };

    override getName(): string {
        return "Standard Touch";
    }
}