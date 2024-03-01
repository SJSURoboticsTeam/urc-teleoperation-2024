/* eslint-disable no-unused-vars */
import { Vector3 } from "three";
import { DEG_TO_RAD, RAD_TO_DEG, clampedAngularLerp, clampedLerp, lawOfCosinesAngle, lawOfCosinesSide } from "./math";
// import { ArmState } from "./robot-types";


/**
 * @typedef {{ rotunda: number, shoulder: number, elbow: number, wristPitch: number, wristRoll: number, effectorPosition: number }} ArmState Arm angles.
 */

// interface ArmInverseKinematicsSolverSettings {
//     lerpAmount: number;
//     maximumAngularSpeed: number;
//     maximumSpeed: number;

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

// export interface ArmInverseKinematicsSolverSettingsArgs {
//     lerpAmount?: number;
//     maximumAngularSpeed?: number;
//     maximumSpeed?: number;

    
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

/**
 * @typedef {{
 *      lerpAmount: number,
*      maximumAngularSpeed: number,
*      maximumSpeed: number,
*      shoulderAbsolutePosition: Vector3,
*      shoulderLength: number,
*      elbowLength: number,
*      wristLength: number,
*      constraints: {
*           rotunda?: Constraint,
*           shoulder?: Constraint,
*           elbow?: Constraint,
*           wristPitch?: Constraint,
*           wristRoll?: Constraint,
*           effectorPosition?: Constraint,
*      }
* }} ArmInverseKinematicsSolverSettings Solver settings.
* @typedef {{
*      lerpAmount?: number,
*      maximumAngularSpeed?: number,
*      maximumSpeed?: number,
*      shoulderAbsolutePosition?: Vector3,
*      shoulderLength?: number,
*      elbowLength?: number,
*      wristLength?: number,
*      constraints?: {
*           rotunda?: Constraint,
*           shoulder?: Constraint,
*           elbow?: Constraint,
*           wristPitch?: Constraint,
*           wristRoll?: Constraint,
*           effectorPosition?: Constraint,
*      }
* }} ArmInverseKinematicsSolverSettingsArgs Arguments into the solver
 * 
 * @typedef {{min:number, max:number}} Constraint Min Max constraints.
 */


/**
 * Returns true if the angle is within the constraints.
 * @param {number} angle 
 * @param {Constraint} constraint 
 * @returns {boolean} true if the angle satisfies the constraint. false otherwise
 */

function satisfyConstraint(angle/* : number */, constraint/* ?:Constraint */) {
    if(constraint == null) return true; // No constraint.
    return constraint.min <= angle && angle <= constraint.max;
}

/**
 * Choose the newTarget if it is valid. Return the defaultValue otherwise.
 * 
 * @param {number} newTarget 
 * @param {number} defaultValue 
 * @param {Constraint} constraint 
 * @returns {number} newTarget if it satisfies the constraint and is not NaN, defaultValue otherwise.
 */
function checkNewTarget(newTarget/* :number */, defaultValue/* : number */, constraint/* ?: Constraint */) {
    if(isNaN(newTarget)) return defaultValue;
    if(!satisfyConstraint(newTarget, constraint)) return defaultValue;
    return newTarget;
}
export class ArmInverseKinematicsSolver {
    // currentAngles: ArmState;
    // homeAngles: ArmState;
    // targetAngles: ArmState;
    // current: Vector3;

    // settings: ArmInverseKinematicsSolverSettings = null!;
    /**
     * Create a new solver with settings.
     * @param {ArmInverseKinematicsSolverSettingsArgs} settings Settings
     */
    constructor(settings/* ? : ArmInverseKinematicsSolverSettingsArgs  */) {

        this.setSettings(settings);

        this.currentAngles = { // What the current arm state is.
            rotunda : 0, // Rotunda
            shoulder : 0, // Shoulder
            elbow : 0, // Elbow
            wristPitch : 0, // Wrist Pitch
            wristRoll : 0, // Wrist Roll
            effectorPosition: 0,
        }
        this.targetAngles = { // Where the arm wants to go
            rotunda : 0, // Rotunda
            shoulder : 0, // Shoulder
            elbow : 0, // Elbow
            wristPitch : 0, // Wrist Pitch
            wristRoll : 0, // Wrist Roll
            effectorPosition: 0,
        }

        this.currentEffector = { // Current effector position.
            roll: 0,
            pitch: 0,
        }

        this.current = new Vector3(); // Where the arm is in cartesian space
    }
    setSettings(settings/* ? : ArmInverseKinematicsSolverSettingsArgs */) {
        if(settings) {
            this.settings = {
                shoulderAbsolutePosition: settings.shoulderAbsolutePosition ?? new Vector3(0, 0.261, 0.287),
                shoulderLength: settings.shoulderLength ?? 1.546,
                elbowLength: settings.elbowLength ?? 1.546,
                wristLength: settings.wristLength ?? 0.6,
                lerpAmount: settings.lerpAmount ?? 10.0,
                maximumAngularSpeed: settings.maximumAngularSpeed ?? 15 * DEG_TO_RAD,
                maximumSpeed: settings.maximumSpeed ?? 0.1,
                constraints: settings.constraints ?? {
                    shoulder: { min: -40 * DEG_TO_RAD, max: 80 * DEG_TO_RAD },
                    elbow: { min: -50 * DEG_TO_RAD, max: 90 * DEG_TO_RAD },
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
                maximumSpeed: 0.1,
                constraints: {
                    shoulder: { min: -40 * DEG_TO_RAD, max: 80 * DEG_TO_RAD },
                    elbow: { min: -50 * DEG_TO_RAD, max: 90 * DEG_TO_RAD },
                    wristPitch: { min: -90 * DEG_TO_RAD, max: 90 * DEG_TO_RAD },
                }
            };
        }
    }

    /**
     * Directly set the current position of the solver.
     * @param {Vector3} target 
     */
    goto(target/* : Vector3 */) {
        this.current = target;
    }

    /**
     * Check if a target configuration is out of bounds.
     * 
     * @param {Vector3} target 
     * @param {number} effectorPitch 
     * @param {number} effectorRoll 
     * @returns {boolean} true if the target configuration is unreachable with the current constraints. False otherwise.
     */
    checkBounds(target/* : Vector3 */, effectorPitch/* : number = 0 */, effectorRoll/* : number = 0 */) /* : boolean */ {
        const r = Math.sqrt(target.x * target.x + target.z * target.z);
        const elevation = target.y - this.settings.shoulderAbsolutePosition.y - this.settings.wristLength * Math.sin(effectorPitch);
        const k = r - this.settings.shoulderAbsolutePosition.z - this.settings.wristLength * Math.cos(effectorPitch);
        const c = Math.sqrt(k * k + elevation * elevation);

        const rotunda= Math.atan2(target.x, target.z);
        const shoulder = Math.PI/2 - (lawOfCosinesAngle(this.settings.elbowLength, c, this.settings.shoulderLength) + Math.asin(elevation / c));
        const elbow = Math.PI/2 - lawOfCosinesAngle(c, this.settings.shoulderLength, this.settings.elbowLength);
        const wristRoll = effectorRoll;

        let outOfBounds = false;
        outOfBounds = outOfBounds || !satisfyConstraint(rotunda, this.settings.constraints.rotunda);
        outOfBounds = outOfBounds || !satisfyConstraint(shoulder, this.settings.constraints.shoulder);
        outOfBounds = outOfBounds || !satisfyConstraint(elbow, this.settings.constraints.elbow);
        outOfBounds = outOfBounds || !satisfyConstraint(wristRoll, this.settings.constraints.wristRoll);
        
        const wristPitch = -(elbow + shoulder + effectorPitch);
        
        outOfBounds = outOfBounds || !satisfyConstraint(wristPitch, this.settings.constraints.wristPitch);

        return outOfBounds;
        
    }
    /**
     * Get the next calculated angles of the arm. Lerps the last target to the current target with a maximum speed.
     * The solver will ignore the target angle if it was out of bounds and will use the previous angle value.
     * 
     * @param {Vector3} target Target position in world space
     * @param {number} effectorPitch Effector Pitch in world space
     * @param {number} effectorRoll Effector roll in world space
     * @param {number} effectorPosition Open/Close position of the end effector.
     * @param {number} dt Time since last frame
     * @returns The new arm angles.
     */
    solve(target/* : Vector3 */, effectorPitch/* : number = 0 */, effectorRoll/* : number = 0 */, effectorPosition/* : number = 0 */, dt/* : number = 0.1 */)/*  : ArmState & { outOfBounds : boolean } */ {
        // SO UH
        // BASICALLY YOU CAN MAKE A TRIANGLE
        // AND UH
        // a is the length of the first linkage (Shoulder/hindArm)
        // b is the length of the second linkage (Elbox/foreArm)
        // c is the distance between the start of the first linkage and the end of the second linkage
        // then you law of cosines your way out.

        // const direction = target.clone().sub(this.current);
        const dir = target.clone().sub(this.current);
        effectorPitch = this.currentEffector.pitch + Math.max(Math.min((effectorPitch - this.currentEffector.pitch) * 0.1, 10 * DEG_TO_RAD), -10 * DEG_TO_RAD);
        this.currentEffector.pitch = effectorPitch;
        effectorRoll = this.currentEffector.roll + Math.max(Math.min((effectorRoll - this.currentEffector.roll) * 0.1, 10 * DEG_TO_RAD), -10 * DEG_TO_RAD);
        this.currentEffector.roll = effectorRoll;
        
        // console.log(this.current);
        let speed = dir.length() * this.settings.lerpAmount;
        speed = Math.max(Math.min(speed, this.settings.maximumSpeed), -this.settings.maximumSpeed);
        target = this.current.clone().add(dir.normalize().multiplyScalar(speed * dt));
        
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

        // let outOfBounds = false;
        // outOfBounds = outOfBounds || !satisfyConstraint(rotunda, this.settings.constraints.rotunda);
        // outOfBounds = outOfBounds || !satisfyConstraint(shoulder, this.settings.constraints.shoulder);
        // outOfBounds = outOfBounds || !satisfyConstraint(elbow, this.settings.constraints.elbow);
        // outOfBounds = outOfBounds || !satisfyConstraint(wristRoll, this.settings.constraints.wristRoll);
        
        const wristPitch = -(this.targetAngles.elbow + this.targetAngles.shoulder + effectorPitch);
        // const wristPitch = -(elbow + shoulder + effectorPitch);
        
        this.targetAngles.wristPitch = checkNewTarget(wristPitch, this.targetAngles.wristPitch, this.settings.constraints.wristPitch);
        // outOfBounds = outOfBounds || !satisfyConstraint(wristPitch, this.settings.constraints.wristPitch);
        // this.currentAngles = {
        //     rotunda: this.targetAngles.rotunda,
        //     shoulder: this.targetAngles.shoulder,
        //     elbow: this.targetAngles.elbow,
        //     wristPitch: clampedLerp(this.currentAngles.wristPitch, this.targetAngles.wristPitch, 0.5, 1),
        //     wristRoll: clampedAngularLerp(this.currentAngles.wristRoll, this.targetAngles.wristRoll, 0.5, 1),
        //     effectorPosition: effectorPosition,
        // }
        // if(!outOfBounds) {
            this.currentAngles = {
                ...this.targetAngles,
                effectorPosition
            };
            this.current = target;
        // }

        return {...this.currentAngles};
    }
}

/**
 * Create a function that solves for the angles in a four bar linkage when given an angle.
 * <pre>
 *           b
 *       /--------/
 *      /       /  c
 * a  / θ     /
 *  /-------/
 *      d
 * </pre>
 * Used to solve for the angles in the effector and in the robot suspension.
 * 
 * @param {number} a Length of side adjacent to theta
 * @param {number} b Length of side adjacent to a
 * @param {number} c Length of side adjacent to d
 * @param {number} d Length of side ddjacent to theta
 * @returns {(theta: number) => [number , number, number, number]} Fourbar linkage solver. Returns a function that returns angles [theta, ab, bc, cd]
 */
export function createFourbarLinkageSolver(a/*  : number */, b/*  : number */, c/*  : number */, d/*  : number */) {
    return (theta/*  : number */) => {
        const x = lawOfCosinesSide(theta, a, d);
        return [
            theta,
            lawOfCosinesAngle(c, x, b) + lawOfCosinesAngle(d, x, a) ,
            lawOfCosinesAngle(x, c, b),
            lawOfCosinesAngle(b, x, c) + lawOfCosinesAngle(a, x, d),
        ];
    }
}