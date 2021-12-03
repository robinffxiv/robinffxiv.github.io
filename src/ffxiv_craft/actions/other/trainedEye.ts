import {Simulation} from "../../simulation";
import {Action} from "../action";

export class TrainedEye extends Action {
    override apply(sim: Simulation) {
        sim.quality = sim.recipe.quality;
        super.apply(sim);
    };
    override cpCost(sim: Simulation): number {
        return 250;
    };
    override isUsable(sim: Simulation): boolean {
        return false;
    };

    override getName(): string {
        return "Trained Eye";
    }
}