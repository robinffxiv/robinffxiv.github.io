import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class WasteNotII extends Action {
    override cpCost(sim: Simulation): number {
        return 98;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.WASTE_NOT_II, 8];
    };

    override getName(): string {
        return "Waste Not II";
    }
}