import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class WasteNot extends Action {
    override cpCost(sim: Simulation): number {
        return 56;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.WASTE_NOT, 4];
    };

    override getName(): string {
        return "Waste Not";
    }
}