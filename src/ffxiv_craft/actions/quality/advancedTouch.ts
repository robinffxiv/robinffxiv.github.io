import {Simulation} from "../../simulation";
import {QualityAction} from "../qualityAction";
import {StandardTouch} from "./standardTouch";

export class AdvancedTouch extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 150;
    };

    override cpCost(sim: Simulation): number {
        return sim.lastAction() === new StandardTouch().getName() ? 18 : 46;
    };

    override getName(): string {
        return "Advanced Touch";
    }
}