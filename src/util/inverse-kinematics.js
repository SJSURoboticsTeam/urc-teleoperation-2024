import { Vector3 } from "three";
import { clampedAngularLerp, clampedLerp, lawOfCosinesAngle, lawOfCosinesSide } from "./math";
// import { ArmState } from "./robot-types";


const DEG_TO_RAD = Math.PI / 180;

// interface ArmInverseKinematicsSolverSettings {
//     lerpAmount: number;
//     maximumAngularSpeed: number;

//     shoulderAbsolutePosition: Vector3;
//     shoulderLength: number;
//     elbowLength: number;
//     wristLength: number;
    
//     constraints: {
//         rotunda? : Constraint; // Rotunda
//         shoulder? : Constraint; // Shoulder
//         elbow? : Constraint; // Elbow
//         wristPitch? : Constraint; // Wrist Pitch
//         wristRoll? : Constraint; // Wrist Roll
//         effectorPosition? : Constraint;
//     };
// }

// interface ArmInverseKinematicsSolverSettingsArgs {
//     lerpAmount?: number;
//     maximumAngularSpeed?: number;
    
//     shoulderAbsolutePosition?: Vector3;
//     shoulderLength?: number;
//     elbowLength?: number;
//     wristLength?: number;

//     constraints?: {
//         rotunda? : Constraint; // Rotunda
//         shoulder? : Constraint; // Shoulder
//         elbow? : Constraint; // Elbow
//         wristPitch? : Constraint; // Wrist Pitch
//         wristRoll? : Constraint; // Wrist Roll
//         effectorPosition? : Constraint;
//     };
// }

// interface Constraint {
//     max: number;
//     min: number;
// }



function satisfyConstraint(angle /* : number */, constraint /* ?:Constraint */) {
    if(constraint == null) return true; // No constraint.
    return constraint.min <= angle && angle <= constraint.max;
}

function checkNewTarget(newTarget /* :number */, defaultValue /* : number */, constraint /* ?: Constraint */) {
    if(isNaN(newTarget)) return defaultValue;
    if(!satisfyConstraint(newTarget, constraint)) return defaultValue;
    return newTarget;
}

export class ArmInverseKinematicsSolver {
    // currentAngles: ArmState;
    // homeAngles: ArmState;
    // targetAngles: ArmState;
    // current: Vector3;

    // settings: ArmInverseKinematicsSolverSettings;
    constructor(settings /* ? : ArmInverseKinematicsSolverSettingsArgs */ ) {
        // this.base = {
        //     position: [0, -1, 0],
        //     rotation: QuaternionO.zeroRotation(),
        // };

        // this.hindArmAbsolutePosition = new Vector3(0, 0.261, 0.287);
        // this.hindArmLength = 1.546;
        // this.foreArmLength = 1.546;
        // this.hindWristLength = 0.6;

        if(settings) {
            this.settings = {
                shoulderAbsolutePosition: settings.shoulderAbsolutePosition ?? new Vector3(0, 0.261, 0.287),
                shoulderLength: settings.shoulderLength ?? 1.546,
                elbowLength: settings.elbowLength ?? 1.546,
                wristLength: settings.wristLength ?? 0.6,
                lerpAmount: settings.lerpAmount ?? 10.0,
                maximumAngularSpeed: settings.maximumAngularSpeed ?? 15 * DEG_TO_RAD,
                constraints: settings.constraints ?? {
                    shoulder: { min: 0, max: 80 * DEG_TO_RAD },
                    elbow: { min: -30 * DEG_TO_RAD, max: 60 * DEG_TO_RAD },
                    wristPitch: { min: -90 * DEG_TO_RAD, max: 90 * DEG_TO_RAD },
                },
            };
        }else {
            this.settings =  {
                shoulderAbsolutePosition: new Vector3(0, 0.261, 0.287),
                shoulderLength: 1.546,
                elbowLength: 1.546,
                wristLength: 0.6,
                lerpAmount: 10.0,
                maximumAngularSpeed: 60 * DEG_TO_RAD,
                constraints: {
                    shoulder: { min: 0, max: 80 * DEG_TO_RAD },
                    elbow: { min: -30 * DEG_TO_RAD, max: 60 * DEG_TO_RAD },
                    wristPitch: { min: -90 * DEG_TO_RAD, max: 90 * DEG_TO_RAD },
                }
            };
        }

        this.currentAngles = {
            rotunda : 0, // Rotunda
            shoulder : 0, // Shoulder
            elbow : 0, // Elbow
            wristPitch : 0, // Wrist Pitch
            wristRoll : 0, // Wrist Roll
            effectorPosition: 0,
        }
        this.targetAngles = {
            rotunda : 0, // Rotunda
            shoulder : 0, // Shoulder
            elbow : 0, // Elbow
            wristPitch : 0, // Wrist Pitch
            wristRoll : 0, // Wrist Roll
            effectorPosition: 0,
        }

        this.homeAngles = {
            rotunda : 0, // Rotunda
            shoulder : 0, // Shoulder
            elbow : 0, // Elbow
            wristPitch : 0, // Wrist Pitch
            wristRoll : 0, // Wrist Roll
            effectorPosition: 0,
        }

        this.current = new Vector3()
    }

    solve(target /* : Vector3 */, effectorPitch /* : number */ = 0, effectorRoll /* : number */ = 0, effectorPosition /* : number */ = 0, dt /* : number  */= 0.1) {
        // SO UH
        // BASICALLY YOU CAN MAKE A TRIANGLE
        // AND UH
        // a is the length of the first linkage (Shoulder/hindArm)
        // b is the length of the second linkage (Elbox/foreArm)
        // c is the distance between the start of the first linkage and the end of the second linkage
        // then you law of cosines your way out.
        
        const r = Math.sqrt(target.x * target.x + target.z * target.z);
        const elevation = target.y - this.settings.shoulderAbsolutePosition.y - this.settings.wristLength * Math.sin(effectorPitch);
        const k = r - this.settings.shoulderAbsolutePosition.z - this.settings.wristLength * Math.cos(effectorPitch);
        const c = Math.sqrt(k * k + elevation * elevation);

        const rotunda= Math.atan2(target.x, target.z);
        const shoulder = Math.PI/2 - (lawOfCosinesAngle(this.settings.elbowLength, c, this.settings.shoulderLength) + Math.asin(elevation / c));
        const elbow = Math.PI/2 - lawOfCosinesAngle(c, this.settings.shoulderLength, this.settings.elbowLength);
        const wristRoll = effectorRoll;
        

        this.targetAngles.rotunda = checkNewTarget(rotunda, this.targetAngles.rotunda, this.settings.constraints.rotunda);
        this.targetAngles.shoulder = checkNewTarget(shoulder, this.targetAngles.shoulder, this.settings.constraints.shoulder);
        this.targetAngles.elbow = checkNewTarget(elbow, this.targetAngles.elbow, this.settings.constraints.elbow);
        this.targetAngles.wristRoll = checkNewTarget(wristRoll, this.targetAngles.wristRoll, this.settings.constraints.wristRoll);
        
        const wristPitch = -(this.targetAngles.elbow + this.targetAngles.shoulder + effectorPitch);
        
        this.targetAngles.wristPitch = checkNewTarget(wristPitch, this.targetAngles.wristPitch, this.settings.constraints.wristPitch);

        const lerpAmount = this.settings.lerpAmount * dt;
        const maxDiff = this.settings.maximumAngularSpeed * dt;

        this.currentAngles = {
            rotunda: clampedAngularLerp(this.currentAngles.rotunda, this.targetAngles.rotunda, lerpAmount, maxDiff),
            shoulder: clampedLerp(this.currentAngles.shoulder, this.targetAngles.shoulder, lerpAmount, maxDiff),
            elbow: clampedLerp(this.currentAngles.elbow, this.targetAngles.elbow, lerpAmount, maxDiff),
            wristPitch: clampedLerp(this.currentAngles.wristPitch, this.targetAngles.wristPitch, 1, 2 * maxDiff),
            wristRoll: clampedAngularLerp(this.currentAngles.wristRoll, this.targetAngles.wristRoll, lerpAmount, maxDiff),
            effectorPosition: effectorPosition,
        }

        return this.currentAngles;
    }
}

export function createFourbarLinkageSolver(a /* : number */, b /* : number */, c /* : number */, d /* : number */) {
    return (theta /* : number */) => {
        const x = lawOfCosinesSide(theta, a, d);
        return [
            theta,
            lawOfCosinesAngle(c, x, b) + lawOfCosinesAngle(d, x, a) ,
            lawOfCosinesAngle(x, c, b),
            lawOfCosinesAngle(b, x, c) + lawOfCosinesAngle(a, x, d),
        ];
    }
}