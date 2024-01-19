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
    const gltf = useLoader(GLTFLoader, "/models/arm.glb");
    const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

    const rotundaObj = useMemo(() => findThreeSubobject(scene, "Rotunda") ?? new Object3D(), [scene]);
    const shoulderObj = useMemo(() => findThreeSubobject(rotundaObj, "Shoulder") ?? new Object3D(), [rotundaObj]);
    const elbowObj = useMemo(() => findThreeSubobject(shoulderObj, "Elbow") ?? new Object3D(), [shoulderObj]);
    const wristPitchObj = useMemo(() => findThreeSubobject(elbowObj, "WristPitch") ?? new Object3D(), [elbowObj]);
    const wristRollObj = useMemo(() => findThreeSubobject(wristPitchObj, "WristRoll") ?? new Object3D(), [wristPitchObj]);

    const rightLinkage1Obj = useMemo(() => findThreeSubobject(wristRollObj, "Right_Linkage_1") ?? new Object3D(), [wristRollObj]);
    const rightLinkage2Obj = useMemo(() => findThreeSubobject(rightLinkage1Obj, "Right_Linkage_2") ?? new Object3D(), [rightLinkage1Obj]);
    const rightLinkage3Obj = useMemo(() => findThreeSubobject(rightLinkage2Obj, "Right_Linkage_3") ?? new Object3D(), [rightLinkage2Obj]);
    const rightLinkage4Obj = useMemo(() => findThreeSubobject(rightLinkage3Obj, "Right_Linkage_4") ?? new Object3D(), [rightLinkage3Obj]);
    const rightLinkageEndReferenceObj = useMemo(() => findThreeSubobject(rightLinkage1Obj, "Right_Linkage_End_Reference") ?? new Object3D(), [rightLinkage1Obj]);

    const leftLinkage1Obj = useMemo(() => findThreeSubobject(wristRollObj, "Left_Linkage_1") ?? new Object3D(), [wristRollObj]);
    const leftLinkage2Obj = useMemo(() => findThreeSubobject(leftLinkage1Obj, "Left_Linkage_2") ?? new Object3D(), [leftLinkage1Obj]);
    const leftLinkage3Obj = useMemo(() => findThreeSubobject(leftLinkage2Obj, "Left_Linkage_3") ?? new Object3D(), [leftLinkage2Obj]);
    // const leftLinkage4Obj = useMemo(() => findThreeSubobject(leftLinkage3Obj, "Left_Linkage_4") ?? new Object3D(), [leftLinkage3Obj]);
    // const leftLinkageEndReferenceObj = useMemo(() => findThreeSubobject(leftLinkage1Obj, "Left_Linkage_End_Reference") ?? new Object3D(), [leftLinkage1Obj]);

    const fourBarSolver = useMemo(() => {
        const a = rightLinkage2Obj.position.length();
        const b = rightLinkage3Obj.position.length();
        const c = rightLinkage4Obj.position.length();
        const d = rightLinkageEndReferenceObj.position.length();

        const diagonal = rightLinkageEndReferenceObj.position.clone().sub(rightLinkage2Obj.position).length();
        
        return createFourbarLinkageSolver(a, b, c, d, diagonal);
    }, [ rightLinkage2Obj, rightLinkage3Obj, rightLinkage4Obj, rightLinkageEndReferenceObj ]);

    rotundaObj.setRotationFromAxisAngle(new Vector3(0, 1, 0), rotunda);
    shoulderObj.setRotationFromAxisAngle(new Vector3(1, 0, 0), shoulder);
    elbowObj.setRotationFromAxisAngle(new Vector3(1, 0, 0), elbow);
    wristPitchObj.setRotationFromAxisAngle(new Vector3(1, 0, 0), wristPitch);
    wristRollObj.setRotationFromAxisAngle(new Vector3(0, 0, 1), wristRoll);

    const linkageAngles = fourBarSolver(effectorPosition);
    // console.log(linkageAngles);
    // console.log(linkageAngles[0] + linkageAngles[1] + linkageAngles[2] + linkageAngles[3])
    rightLinkage1Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[0]);
    rightLinkage2Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[1]);
    rightLinkage3Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), linkageAngles[2]);
    leftLinkage1Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[0]);
    leftLinkage2Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[1]);
    leftLinkage3Obj.setRotationFromAxisAngle(new Vector3(0, 1, 0), -linkageAngles[2]);

    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={rotundaObj}/>
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

