import {Simulation} from "../../simulation";
import {Condition} from "../../craft_util";
import {Action} from "../action";

export class TricksOfTheTrade extends Action {
    override isUsable(sim: Simulation): boolean {
        return (sim.condition === Condition.GOOD || sim.condition === Condition.EXCELLENT) && super.isUsable(sim);
    };

    override cpCost(sim: Simulation): number {
        return -20;
    };

    override getName(): string {
        return "Tricks of the Trade";
    }
}