import { createFourbarLinkageSolver } from "../../util/inverse-kinematics";
// import { ArmState } from "@/robot-types";
import { Axis, useThreeSubobject } from "../three-util";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * Use the arm model. Returns the arm and each motor (for feedback display).
 * 
 * @param {Object3D} mountPoint 
 * @param {import("../inverse-kinematics").ArmState} param1 
 * @returns {{
 *      arm: Object3D,
 *      motors: {
*          rotunda: Object3D,
*          shoulder: Object3D,
*          elbow: Object3D,
*          wristPitch: Object3D,
*          wristRoll: Object3D,
 *      }
 * }}
 */
export function useArmModel(mountPoint/* : Object3D */, { rotunda, elbow, shoulder, wristRoll, wristPitch, effectorPosition } /* : ArmState */) {
    const armGltf = useLoader(GLTFLoader, "/models/Arm-High-Quality.glb");
    const arm = useMemo(() => {
        const arm = armGltf.scene.children[0].clone(true);
        mountPoint.add(arm);
        return arm;
    }, [armGltf, mountPoint]);

    const rotundaObj = arm
    const shoulderObj = useThreeSubobject(rotundaObj, "Shoulder");
    const elbowObj = useThreeSubobject(shoulderObj, "Elbow");
    const wristPitchObj = useThreeSubobject(elbowObj, "Wrist_Pitch");
    const wristRollObj = useThreeSubobject(wristPitchObj, "Wrist_Roll");

    const motors = {
        rotunda: useThreeSubobject(arm, "Rotunda_Motor"),
        shoulder: useThreeSubobject(arm, "Shoulder_Motor"),
        elbow: useThreeSubobject(shoulderObj, "Elbow_Motor"),
        wristLeft: useThreeSubobject(elbowObj, "Wrist_Motor_Left"),
        wristRight: useThreeSubobject(elbowObj, "Wrist_Motor_Right"),
    };

    const rightLinkage1Obj = useThreeSubobject(wristRollObj, "Right_Linkage_1")
    const rightLinkage2Obj = useThreeSubobject(rightLinkage1Obj, "Right_Linkage_2")
    const rightLinkage3Obj = useThreeSubobject(rightLinkage2Obj, "Right_Linkage_3") 
    const rightLinkage4Obj = useThreeSubobject(rightLinkage3Obj, "Right_Linkage_4")
    const rightLinkage5Obj = useThreeSubobject(rightLinkage4Obj, "Right_Linkage_5") 

    const leftLinkage1Obj = useThreeSubobject(wristRollObj, "Left_Linkage_1")
    const leftLinkage2Obj = useThreeSubobject(leftLinkage1Obj, "Left_Linkage_2")
    const leftLinkage3Obj = useThreeSubobject(leftLinkage2Obj, "Left_Linkage_3")
    const leftLinkage4Obj = useThreeSubobject(leftLinkage3Obj, "Left_Linkage_4")
    const leftLinkage5Obj = useThreeSubobject(leftLinkage4Obj, "Left_Linkage_5")

    const fourBarSolver = useMemo(() => {
        const d = rightLinkage2Obj.position.length();
        const a = rightLinkage3Obj.position.length();
        const b = rightLinkage4Obj.position.length();
        const c = rightLinkage5Obj.position.length();

        const initialAngle = rightLinkage2Obj.position.clone().multiplyScalar(-1).angleTo(rightLinkage3Obj.position);
        
        const solve = createFourbarLinkageSolver(a, b, c, d);

        return (theta/*  : number */) => {
            const [ a, b, c, d ] = solve(-theta + initialAngle);
            return [
                theta,
                b,
                c,
                d
            ];
        }
    }, [ rightLinkage2Obj, rightLinkage3Obj, rightLinkage4Obj, rightLinkage5Obj ]);

    rotundaObj.setRotationFromAxisAngle(Axis.yaw, rotunda);
    shoulderObj.setRotationFromAxisAngle(Axis.pitch, shoulder);
    elbowObj.setRotationFromAxisAngle(Axis.pitch, elbow);
    wristPitchObj.setRotationFromAxisAngle(Axis.pitch, wristPitch);
    wristRollObj.setRotationFromAxisAngle(Axis.roll, wristRoll);

    const linkageAngles = fourBarSolver((22 - -40) * effectorPosition / 100 );

    rightLinkage2Obj.setRotationFromAxisAngle(Axis.yaw, linkageAngles[0]);
    rightLinkage3Obj.setRotationFromAxisAngle(Axis.yaw, Math.PI-linkageAngles[1]);
    rightLinkage4Obj.setRotationFromAxisAngle(Axis.yaw, Math.PI-linkageAngles[2]);
    
    leftLinkage2Obj.setRotationFromAxisAngle(Axis.yaw, -linkageAngles[0]);
    leftLinkage3Obj.setRotationFromAxisAngle(Axis.yaw, -Math.PI+linkageAngles[1]);
    leftLinkage4Obj.setRotationFromAxisAngle(Axis.yaw, -Math.PI+linkageAngles[2]);

    return {
        arm,
        motors
    };
}