import {Action} from "./action";
import {FinalAppraisal} from "./buff/finalAppraisal";
import {GreatStrides} from "./buff/greatStrides";
import {Innovation} from "./buff/innovation";
import {Manipulation} from "./buff/manipulation";
import {Veneration} from "./buff/veneration";
import {WasteNot} from "./buff/wasteNot";
import {WasteNotII} from "./buff/wasteNotII";
import {DelicateSynthesis} from "./other/delicateSynthesis";
import {MastersMend} from "./other/mastersMend";
import {Observe} from "./other/observe";
import {BasicSynthesis} from "./progress/basicSynthesis";
import {CarefulSynthesis} from "./progress/carefulSynthesis";
import {FocusedSynthesis} from "./progress/focusedSynthesis";
import {Groundwork} from "./progress/groundwork";
import {MuscleMemory} from "./progress/muscleMemory";
import {PrudentSynthesis} from "./progress/prudentSynthesis";
import {AdvancedTouch} from "./quality/advancedTouch";
import {BasicTouch} from "./quality/basicTouch";
import {ByregotsBlessing} from "./quality/byregotsBlessing";
import {PreparatoryTouch} from "./quality/preparatoryTouch";
import {PrudentTouch} from "./quality/prudentTouch";
import {Reflect} from "./quality/reflect";
import {StandardTouch} from "./quality/standardTouch";
import {TrainedFinesse} from "./quality/trainedFinesse";


export const possibleActions: Action[] = [//new FinalAppraisal(),
    new GreatStrides(),
    new Innovation(),
    new Manipulation(),
    new Veneration(),
    new WasteNot(),
    new WasteNotII(),
    new DelicateSynthesis(),
    new MastersMend(),
    new Observe(),
    new BasicSynthesis(),
    new CarefulSynthesis(),
    new FocusedSynthesis(),
    new Groundwork(),
    new MuscleMemory(),
    new PrudentSynthesis(),
    new AdvancedTouch(),
    new BasicTouch(),
    new ByregotsBlessing(),
    new FocusedSynthesis(),
    new PreparatoryTouch(),
    new PrudentTouch(),
    new Reflect(),
    new StandardTouch(),
    new TrainedFinesse()]
