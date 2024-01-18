import { Vector3 } from "three";
// import { ArmState } from "./components/arm-viewport/arm-viewport";


const DEG_TO_RAD = Math.PI / 180;

function    clampedLerp(a /* :number */, b /* :number */, t /* :number */, maxDiff /* :number */) {
    t = Math.max(0, Math.min(1, t));

    const change = Math.max(Math.min((b - a) * t, maxDiff), -maxDiff);
    return a + change;
}

function clampedAngularLerp(a /* :number */, b /* :number */, t /* :number */, maxDiff /* :number */) {
    t = Math.max(0, Math.min(1, t));

    let difference = b - a
    if(difference > Math.PI) {
        difference -= Math.PI * 2;
    }else if(difference < -Math.PI) {
        difference += Math.PI * 2;
    }

    const change = Math.max(Math.min(difference * t, maxDiff), -maxDiff);
    return a + change;
}

function lawOfCosinesAngle(a /* :number */, b /* :number */, c /* :number */) /* :number */ {
    return Math.acos((a * a - b * b - c * c) / (-2 * b * c));
}

// interface ArmInverseKinematicsSolverSettings {
//     lerpAmount: number;
//     maximumAngularSpeed: number;
    
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


function satisfyConstraint(angle /* : number */, constraint /* ?: Constraint */) {
    if(constraint == null) return true; // No constraint.
    return constraint.min <= angle && angle <= constraint.max;
}

function checkNewTarget(newTarget /* : number */, defaultValue /* : number */, constraint /* ?: Constraint */) {
    if(isNaN(newTarget)) return defaultValue;
    if(!satisfyConstraint(newTarget, constraint)) return defaultValue;
    return newTarget;
}

export class ArmInverseKinematicsSolver {
    // hindArmAbsolutePosition: Vector3;
    // hindArmLength: number;
    // foreArmLength: number;
    // hindWristLength: number;
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

        this.hindArmAbsolutePosition = new Vector3(0, 0.261, 0.287).add(new Vector3(0, -1, 0));
        this.hindArmLength = 1.546;
        this.foreArmLength = 1.546;
        this.hindWristLength = 0.6;

        if(settings) {
            this.settings = {
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

    solve(target /* : Vector3 */, effectorPitch /* : number */ = 0, effectorRoll /* : number */ = 0, effectorPosition /* : number */ = 0, dt /* : number */ = 0.1) {
        // SO UH
        // BASICALLY YOU CAN MAKE A TRIANGLE
        // AND UH
        // a is the length of the first linkage (Shoulder/hindArm)
        // b is the length of the second linkage (Elbox/foreArm)
        // c is the distance between the start of the first linkage and the end of the second linkage
        // then you law of cosines your way out.
        
        const r = Math.sqrt(target.x * target.x + target.z * target.z);
        const elevation = target.y - this.hindArmAbsolutePosition.y - this.hindWristLength * Math.sin(effectorPitch);
        const k = r - this.hindArmAbsolutePosition.z - this.hindWristLength * Math.cos(effectorPitch);
        const c = Math.sqrt(k * k + elevation * elevation);

        const rotunda= Math.atan2(target.x, target.z);
        const shoulder = Math.PI/2 - (lawOfCosinesAngle(this.foreArmLength, c, this.hindArmLength) + Math.asin(elevation / c));
        const elbow = Math.PI/2 - lawOfCosinesAngle(c, this.hindArmLength, this.foreArmLength);
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
            wristPitch: clampedLerp(this.currentAngles.wristPitch, this.targetAngles.wristPitch, 1, maxDiff),
            wristRoll: clampedAngularLerp(this.currentAngles.wristRoll, this.targetAngles.wristRoll, lerpAmount, maxDiff),
            effectorPosition: effectorPosition,
        }

        return this.currentAngles;
    }
}


function lawOfCosinesSide(theta /* :number */, b /* :number */, c /* :number */) /* :number */ {
    return Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(theta));
}

export function createFourbarLinkageSolver(a /* : number */, b /* : number */, c /* : number */, d /* : number */, diagonal /* : number */) {
    const initialAngles = [
        lawOfCosinesAngle(diagonal, a, d),
        lawOfCosinesAngle(c, diagonal, b) + lawOfCosinesAngle(d, diagonal, a),
        lawOfCosinesAngle(diagonal, c, b),
        lawOfCosinesAngle(b, diagonal, c) + lawOfCosinesAngle(a, diagonal, d),
    ];

    return (theta /* : number */) => {
        const x = lawOfCosinesSide(theta + initialAngles[0], a, d);
        return [
            theta,
            lawOfCosinesAngle(c, x, b) + lawOfCosinesAngle(d, x, a) - initialAngles[1],
            lawOfCosinesAngle(x, c, b) - initialAngles[2],
            lawOfCosinesAngle(b, x, c) + lawOfCosinesAngle(a, x, d) - initialAngles[3],
        ];
        // const x = lawOfCosinesSide(theta, a, d);
        // return [
        //     theta,
        //     lawOfCosinesAngle(c, x, b) + lawOfCosinesAngle(d, x, a),
        //     lawOfCosinesAngle(x, c, b),
        //     lawOfCosinesAngle(b, x, c) + lawOfCosinesAngle(a, x, d),
        // ];
    }
}