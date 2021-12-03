import {Simulation} from "../../simulation";
import {Action} from "../action";

export class Observe extends Action {
    override cpCost(sim: Simulation): number {
        return 12;
    };

    override getName(): string {
        return "Observe";
    }
}