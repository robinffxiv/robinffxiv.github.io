import {Simulation} from "../../simulation";
import {SynthAction} from "../synthAction";

export class BrandOfTheElements extends SynthAction {
    override progressAdded(sim: Simulation, buffs: number): number {
        const nameBonus = 2 * Math.ceil((1 - sim.progress / sim.totalProgressFactor()) * 100);
        return super.progressAdded(sim, buffs) + nameBonus;
    };

    override getPotency(sim: Simulation): number {
        return 100;
    };

    override getName(): string {
        return "Brand of the Elements";
    }
}