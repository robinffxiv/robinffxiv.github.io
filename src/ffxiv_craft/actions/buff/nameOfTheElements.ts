import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class NameOfTheElements extends Action {
    override cpCost(sim: Simulation): number {
        return 30;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.NAME_OF_THE_ELEMENTS, 3];
    };

    override isUsable(sim: Simulation): boolean {
        return !(sim.hasBuff(Buff.NAME_OF_THE_ELEMENTS) || sim.hasBuff(Buff.NAMELESS)) && super.isUsable(sim);
    }

    override getName(): string {
        return "Name of the Elements";
    }
}