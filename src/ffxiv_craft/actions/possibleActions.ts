import {
    BasicTouch,
    ByregotsBlessing,
    HastyTouch,
    PatientTouch,
    PreciseTouch,
    PreparatoryTouch,
    PrudentTouch,
    Reflect,
    StandardTouch
} from "./quality";
import {
    BasicSynthesis,
    BrandOfTheElements,
    CarefulSynthesis,
    FocusedSynthesis,
    Groundwork,
    IntensiveSynthesis,
    MuscleMemory,
    RapidSynthesis
} from "./progress";
import {
    DelicateSynthesis,
    MastersMend,
    Observe,
    TrainedEye,
    TricksOfTheTrade
} from "./other";
import {
    FinalAppraisal,
    GreatStrides,
    InnerQuiet,
    Innovation,
    Manipulation,
    NameOfTheElements,
    Veneration,
    WasteNot,
    WasteNotII
} from "./buff";
import {Action} from "./action";

export const possibleActions: Action[] = [ new BasicSynthesis(),
                                    new BasicTouch(),
                                    new MastersMend(),
                                    new HastyTouch(),
                                    new RapidSynthesis(),
                                    new InnerQuiet(),
                                    new Observe(),
                                    new TricksOfTheTrade(),
                                    new WasteNot(),
                                    new Veneration(),
                                    new StandardTouch(),
                                    new GreatStrides(),
                                    new Innovation(),
                                    new NameOfTheElements(),
                                    new BrandOfTheElements(),
                                    new FinalAppraisal(),
                                    new WasteNotII(),
                                    new ByregotsBlessing(),
                                    new PreciseTouch(),
                                    new MuscleMemory(),
                                    new CarefulSynthesis(),
                                    new PatientTouch(),
                                    new Manipulation(),
                                    new PrudentTouch(),
                                    new FocusedSynthesis(),
                                    new Reflect(),
                                    new PreparatoryTouch(),
                                    new Groundwork(),
                                    new DelicateSynthesis(),
                                    new IntensiveSynthesis(),
                                    new TrainedEye()];
