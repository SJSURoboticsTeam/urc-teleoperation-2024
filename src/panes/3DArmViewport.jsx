/* eslint-disable react/prop-types */
// DO SEND STUPID STUFF TO THESE COMPONENTS IG

"use client"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { DirectionalLight, Object3D, Vector3 } from "three";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { TransformControls } from "three/examples/jsm/Addons.js";

import { Html, OrbitControls, TransformControls, useProgress } from '@react-three/drei'
import { ArmInverseKinematicsSolver, createFourbarLinkageSolver } from "../util/inverse-kinematics";


function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
  }
  
// export interface ArmState {
//     rotunda : number; // Rotunda
//     shoulder : number; // Shoulder
//     elbow : number; // Elbow
//     wristPitch : number; // Wrist Pitch
//     wristRoll : number; // Wrist Roll
//     effectorPosition: number;
// };

// export interface EffectorState {
//     pitch: number;
//     roll: number;
//     position: number;
// }

function findThreeSubobject(object /* : Object3D */, key /* :string */) /* : Object3D|null */ {
    const subobject = object.children.find((child) => child.name === key);
    if(subobject == null) {
        console.error(key, " not found in ", object);
        return null;
    }else{
        return subobject;
    }
    
}

export function ArmModel({ rotunda, elbow, shoulder, wristRoll, wristPitch, effectorPosition } /* : ArmState */) {
    const { scene } = useLoader(GLTFLoader, "/models/arm.glb");
    const copiedScene = useMemo(() => scene.clone(true), [scene])
    // console.log(copiedScene);
    const rotundaRef = useRef(new Object3D());
    const shoulderRef = useRef(new Object3D());
    const elbowRef = useRef(new Object3D());
    const wristPitchRef = useRef(new Object3D());
    const wristRollRef = useRef(new Object3D());

    const rightLinkage1Ref = useRef(new Object3D());
    const rightLinkage2Ref = useRef(new Object3D());
    const rightLinkage3Ref = useRef(new Object3D());
    const rightLinkage4Ref = useRef(new Object3D());
    const rightLinkageEndReferenceRef = useRef(new Object3D());

    const leftLinkage1Ref = useRef(new Object3D());
    const leftLinkage2Ref = useRef(new Object3D());
    const leftLinkage3Ref = useRef(new Object3D());
    const leftLinkage4Ref = useRef(new Object3D());
    const leftLinkageEndReferenceRef = useRef(new Object3D());

    const fourBarSolverRef = useRef(createFourbarLinkageSolver(0,0,0,0,0));

    useEffect(() => {

        rotundaRef.current = findThreeSubobject(copiedScene, "Base") ?? new Object3D();
        shoulderRef.current = findThreeSubobject(rotundaRef.current, "Hind_Arm") ?? new Object3D();
        elbowRef.current = findThreeSubobject(shoulderRef.current, "Fore_Arm") ?? new Object3D();
        wristPitchRef.current = findThreeSubobject(elbowRef.current, "Upper_Wrist") ?? new Object3D();
        wristRollRef.current = findThreeSubobject(wristPitchRef.current, "Lower_Wrist") ?? new Object3D();
    
        rotundaRef.current.position.set(0,-1,0);
        rotundaRef.current.scale.set(1, 1, 1);

        rightLinkage1Ref.current = findThreeSubobject(wristRollRef.current, "Right_Linkage") ?? new Object3D();
        rightLinkage2Ref.current = findThreeSubobject(rightLinkage1Ref.current, "Right_Linkage_2") ?? new Object3D();
        rightLinkage3Ref.current = findThreeSubobject(rightLinkage2Ref.current, "Right_Linkage_3") ?? new Object3D();
        rightLinkage4Ref.current = findThreeSubobject(rightLinkage3Ref.current, "Right_Linkage_4") ?? new Object3D();
        rightLinkageEndReferenceRef.current = findThreeSubobject(rightLinkage1Ref.current, "Right_Linkage_End_Reference") ?? new Object3D();

        leftLinkage1Ref.current = findThreeSubobject(wristRollRef.current, "Left_Linkage_1") ?? new Object3D();
        leftLinkage2Ref.current = findThreeSubobject(leftLinkage1Ref.current, "Left_Linkage_2") ?? new Object3D();
        leftLinkage3Ref.current = findThreeSubobject(leftLinkage2Ref.current, "Left_Linkage_3") ?? new Object3D();
        leftLinkage4Ref.current = findThreeSubobject(leftLinkage3Ref.current, "Left_Linkage_4") ?? new Object3D();
        leftLinkageEndReferenceRef.current = findThreeSubobject(leftLinkage1Ref.current, "Left_Linkage_End_Reference") ?? new Object3D();

        console.log(rightLinkage1Ref.current);
        console.log(rightLinkage2Ref.current);
        console.log(rightLinkage3Ref.current);
        console.log(rightLinkage4Ref.current);
        console.log(rightLinkageEndReferenceRef.current);

        const a = rightLinkage2Ref.current.position.length();
        const b = rightLinkage3Ref.current.position.length();

        const c = rightLinkage4Ref.current.position.length();
        const d = rightLinkageEndReferenceRef.current.position.length();
        
        const diagonal = rightLinkageEndReferenceRef.current.position.clone().sub(rightLinkage2Ref.current.position).length();

        console.log(a, b, c, d, diagonal);
        fourBarSolverRef.current = createFourbarLinkageSolver(a, b, c, d, diagonal);
        const result = fourBarSolverRef.current(Math.PI);
        console.log(result);
        console.log(result[0] + result[1] + result[2] + result[3])

        // console.log(rightLinkage1Ref.current.position.clone().sub(rightLinkage2Ref.current.position).length());
        // console.log(rightLinkage2Ref.current.position.clone().sub(rightLinkage3Ref.current.position).length());
        // console.log(rightLinkage3Ref.current.position.clone().sub(rightLinkage4Ref.current.position).length());
        // // console.log(rightLinkage4Ref.current.position.clone().sub(rightLinkageRef.current.position).length());
        // console.log(rightLinkageEndReferenceRef.current.position.clone().sub(rightLinkage1Ref.current.position).length());

        return () => {

        }
    }, [copiedScene]);

    rotundaRef.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), rotunda);
    shoulderRef.current.setRotationFromAxisAngle(new Vector3(1, 0, 0), shoulder);
    elbowRef.current.setRotationFromAxisAngle(new Vector3(1, 0, 0), elbow);
    wristPitchRef.current.setRotationFromAxisAngle(new Vector3(1, 0, 0), wristPitch);
    wristRollRef.current.setRotationFromAxisAngle(new Vector3(0, 0, 1), wristRoll);

    const linkageAngles = fourBarSolverRef.current(effectorPosition);
    // console.log(linkageAngles);
    // console.log(linkageAngles[0] + linkageAngles[1] + linkageAngles[2] + linkageAngles[3])
    rightLinkage1Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[0]);
    rightLinkage2Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[1]);
    rightLinkage3Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[2]);
    leftLinkage1Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[0]);
    leftLinkage2Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[1]);
    leftLinkage3Ref.current.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[2]);

    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={copiedScene}/>
}

function FollowingLight({ color, intensity, position } /* : { color?:ColorRepresentation, intensity?:number, position?:Vector3Tuple } */) {
    const { scene, camera } = useThree();
    const lightRef = useRef(new DirectionalLight(color, intensity));

    if(intensity != null) { 
        lightRef.current.intensity = intensity;
    }
    if(color != null) {
        lightRef.current.color.set(color);
    }
    if(position != null) {
        lightRef.current.position.set(...position);
    }
    
    useEffect(() => {
        scene.add(camera);
        camera.add(lightRef.current);

        return () => {
            scene.remove(camera);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            camera.remove(lightRef.current);
        }
    }, [camera, scene]); 

    return null;
}

export function ArmViewport(/* : ArmState */) {

    const [ angles, setAngles ] = useState({
        rotunda: 0, // Rotunda
        shoulder: 0, // Shoulder
        elbow: 0, // Elbow
        wristPitch: 0, // Wrist Pitch
        wristRoll: 0, // Wrist Roll
        effectorPosition: 0,
    });

    return <Canvas
            linear
            camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
            >
                <Suspense fallback={<Loader/>}>
                    <FollowingLight color={0xffffff} intensity={10} position={[0, 0, 1]}/>
                    <OrbitControls makeDefault/>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <ambientLight intensity={0.1} />
                    <ArmModel {...angles}/>
                </Suspense>
    </Canvas>
}





function ArmInverseKinematicsController({ setAngles, effectorState } /* : { setAngles : (newAngles : ArmState) => void, effectorState: EffectorState} */) {
    
    const armInverseKinematicsSolverRef = useRef(new ArmInverseKinematicsSolver());
    const targetRef = useRef(new Object3D());

    useEffect(() => {
        targetRef.current.position.set(0,1, 2.5);
    }, [])

    useFrame((state, dt) => {
        const angles = armInverseKinematicsSolverRef.current.solve(targetRef.current.position.clone(), effectorState.pitch, effectorState.roll, effectorState.position, dt);
        setAngles(angles);
    });

    
    return <>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <primitive object={targetRef.current}/>
        <TransformControls object={targetRef.current} />
    </>
}

export function ArmPlayground() {

    const [ angles, setAngles ] = useState({
        rotunda: 0, // Rotunda
        shoulder: 0, // Shoulder
        elbow: 0, // Elbow
        wristPitch: 0, // Wrist Pitch
        wristRoll: 0, // Wrist Roll
        effectorPosition: 0,
    });
    
    const [ effectorState, setEffectorState ] = useState({ pitch: 0, roll: 0, position: 0 });

    return <Canvas
            linear
            camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
            >
        <Suspense fallback={<Loader/>}>
            <FollowingLight color={0xffffff} intensity={10} position={[0, 0, 1]}/>
            <OrbitControls makeDefault/>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <ambientLight intensity={0.1} />
            <ArmModel {...angles}/>
            <ArmInverseKinematicsController setAngles={setAngles} effectorState={effectorState}/>
            <gridHelper/>
        </Suspense>
</Canvas>
}

