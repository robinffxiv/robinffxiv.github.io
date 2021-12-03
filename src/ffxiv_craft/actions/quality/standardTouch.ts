import {Simulation} from "../../simulation";
import {BasicTouch} from "./basicTouch";
import {QualAction} from "../qualAction";

export class StandardTouch extends QualAction {
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