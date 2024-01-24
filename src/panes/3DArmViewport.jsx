/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
// DO SEND STUPID STUFF TO THESE COMPONENTS IG

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Object3D, Vector3 } from "three";

import { OrbitControls, TransformControls } from '@react-three/drei'
import { ArmInverseKinematicsSolver } from "../util/inverse-kinematics";
// import { ArmState, EffectorState } from "@/robot-types";
import { useArm } from "../util/models/arm";
import { FollowingLight, Loader, SelectableBackground } from "../util/three-util-elements"
import { folder, useControls } from "leva";

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = 1 / RAD_TO_DEG;

export function ArmModel(armState /* : ArmState */) {
    const origin = useMemo(() => new Object3D(), []);
    const [ arm ] = useArm(origin, armState);
    return <primitive object={arm}/>
}

export function ArmViewport( /* : ArmState */) {

    // const [ angles, setAngles ] = useState/* <ArmState> */({
    //     rotunda: 0, // Rotunda
    //     shoulder: 0, // Shoulder
    //     elbow: 0, // Elbow
    //     wristPitch: 0, // Wrist Pitch
    //     wristRoll: 0, // Wrist Roll
    //     effectorPosition: 0,
    // });
    
    console.warn("The arm viewport is running in uncontrolled mode.\nThe component will provide its own control panel to control its state.");
    const {
        rotunda,
        shoulder,
        elbow,
        wristPitch,
        wristRoll,
        effectorPosition
    } = useControls("Arm", {
        rotunda: {
            value: 0,
        },
        shoulder: {
            value: 0,
            max: 90,
            min: -30,
        },
        elbow: {
            value: 0,
            max: 60,
            min: -30
        },
        wristPitch: {
            value: 0,
            max: 90,
            min: -90,
        },
        wristRoll: {
            value: 0,
        },
        effectorPosition: {
            value: 0,
            max: 30,
            min: -20,
        },
    });

    // const [ effectorState, setEffectorState ] = useState/* <EffectorState> */({ pitch: 0, roll: 0, position: 0 });
    return <Canvas
            linear
            camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
            >
                <Suspense fallback={<Loader/>}>
                    <SelectableBackground/>
                    <FollowingLight color={0xffffff} intensity={10} position={[0, 0, 1]}/>
                    <OrbitControls makeDefault/>
                    <ArmModel 
                        rotunda={rotunda * DEG_TO_RAD}
                        shoulder={shoulder * DEG_TO_RAD}
                        elbow={elbow * DEG_TO_RAD}
                        wristPitch={wristPitch * DEG_TO_RAD}
                        wristRoll={wristRoll * DEG_TO_RAD}
                        effectorPosition={effectorPosition * DEG_TO_RAD}
                    />
                </Suspense>
    </Canvas>
}





function ArmInverseKinematicsController({ setAngles, effectorState } /* : { setAngles : (newAngles : ArmState) => void, effectorState: EffectorState} */) {
    const armInverseKinematicsSolverRef = useRef(new ArmInverseKinematicsSolver({
        shoulderAbsolutePosition: new Vector3(0, 0.088, 0.085),
        shoulderLength: 0.457,
        elbowLength: 0.457,
        wristLength: 0.2,
        maximumAngularSpeed: 2 * Math.PI,
    }));
    const targetRef = useRef(new Object3D());

    useEffect(() => {
        targetRef.current.position.set(0,0.5, 0.5);
    }, [])

    useFrame((state, dt) => {
        const angles = armInverseKinematicsSolverRef.current.solve(targetRef.current.position.clone(), effectorState.pitch, effectorState.roll, effectorState.position, dt);
        setAngles(angles);
    });

    
    return <>
        <primitive object={targetRef.current}/>
        <TransformControls object={targetRef.current} />
    </>
}

export function ArmPlayground( /* : { angles: ArmState, setAngles : (newAngles : ArmState) => void, effectorState: EffectorState} */) {


    const [ angles, setAngles ] = useState/* <ArmState> */({
        rotunda: 0, // Rotunda
        shoulder: 0, // Shoulder
        elbow: 0, // Elbow
        wristPitch: 0, // Wrist Pitch
        wristRoll: 0, // Wrist Roll
        effectorPosition: 0,
      });
    
    console.warn("The arm viewport is running in uncontrolled mode.\nThe component will provide its own control panel to control its state.");
    // const [ effectorState, setEffectorState ] = useState/* <EffectorState> */({ pitch: 0, roll: 0, position: 0 });
    const { pitch, roll, position } = useControls("Inverse Kinematics", {
        effector: folder({
            pitch: {
                value: 0,
                max: 90,
                min: -90,
            },
            roll: {
                value: 0,
                step: 1,
            },
            position: {
                value: 0,
                max: 40,
                min: -20,
            }
        })
    });

    return <Canvas
            linear
            camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
            >
        <Suspense fallback={<Loader/>}>
            <SelectableBackground/>
            <FollowingLight color={0xffffff} intensity={1} position={[0, 0, 1]}/>
            <OrbitControls makeDefault/>
            <ArmModel {...angles}/>
            <ArmInverseKinematicsController setAngles={setAngles} effectorState={{
                pitch: pitch * DEG_TO_RAD,
                roll: roll * DEG_TO_RAD,
                position: position * DEG_TO_RAD
            }}/>
            <gridHelper/>
        </Suspense>
</Canvas>
}

