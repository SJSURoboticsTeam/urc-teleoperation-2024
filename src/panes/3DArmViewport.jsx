// /* eslint-disable react/no-unknown-property */
// /* eslint-disable react/prop-types */
// // DO SEND STUPID STUFF TO THESE COMPONENTS IG

// import { Canvas, useFrame } from "@react-three/fiber";
// import { Suspense, useEffect, useMemo, useRef, useState } from "react";
// import { Object3D, Vector3 } from "three";

// import { OrbitControls, TransformControls } from '@react-three/drei'
// import { ArmInverseKinematicsSolver } from "../util/inverse-kinematics";
// // import { ArmState, EffectorState } from "@/robot-types";
// import { useArm } from "../util/models/arm";
// import { FollowingLight, Loader, SelectableBackground } from "../util/three-util-elements"
// import { folder, useControls } from "leva";

// const RAD_TO_DEG = 180 / Math.PI;
// const DEG_TO_RAD = 1 / RAD_TO_DEG;

// export function ArmModel(armState /* : ArmState */) {
//     const origin = useMemo(() => new Object3D(), []);
//     const [ arm ] = useArm(origin, armState);
//     return <primitive object={arm}/>
// }

// export function ArmViewport( /* : ArmState */) {

//     // const [ angles, setAngles ] = useState/* <ArmState> */({
//     //     rotunda: 0, // Rotunda
//     //     shoulder: 0, // Shoulder
//     //     elbow: 0, // Elbow
//     //     wristPitch: 0, // Wrist Pitch
//     //     wristRoll: 0, // Wrist Roll
//     //     effectorPosition: 0,
//     // });
    
//     console.warn("The arm viewport is running in uncontrolled mode.\nThe component will provide its own control panel to control its state.");
//     const {
//         rotunda,
//         shoulder,
//         elbow,
//         wristPitch,
//         wristRoll,
//         effectorPosition
//     } = useControls("Arm", {
//         rotunda: {
//             value: 0,
//         },
//         shoulder: {
//             value: 0,
//             max: 90,
//             min: -30,
//         },
//         elbow: {
//             value: 0,
//             max: 60,
//             min: -30
//         },
//         wristPitch: {
//             value: 0,
//             max: 90,
//             min: -90,
//         },
//         wristRoll: {
//             value: 0,
//         },
//         effectorPosition: {
//             value: 0,
//             max: 30,
//             min: -20,
//         },
//     });

//     // const [ effectorState, setEffectorState ] = useState/* <EffectorState> */({ pitch: 0, roll: 0, position: 0 });
//     return <Canvas
//             linear
//             camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
//             >
//                 <Suspense fallback={<Loader/>}>
//                     <SelectableBackground/>
//                     <FollowingLight color={0xffffff} intensity={10} position={[0, 0, 1]}/>
//                     <OrbitControls makeDefault/>
//                     <ArmModel 
//                         rotunda={rotunda * DEG_TO_RAD}
//                         shoulder={shoulder * DEG_TO_RAD}
//                         elbow={elbow * DEG_TO_RAD}
//                         wristPitch={wristPitch * DEG_TO_RAD}
//                         wristRoll={wristRoll * DEG_TO_RAD}
//                         effectorPosition={effectorPosition * DEG_TO_RAD}
//                     />
//                 </Suspense>
//     </Canvas>
// }





// function ArmInverseKinematicsController({ setAngles, effectorState } /* : { setAngles : (newAngles : ArmState) => void, effectorState: EffectorState} */) {
//     const armInverseKinematicsSolverRef = useRef(new ArmInverseKinematicsSolver({
//         shoulderAbsolutePosition: new Vector3(0, 0.088, 0.085),
//         shoulderLength: 0.457,
//         elbowLength: 0.457,
//         wristLength: 0.2,
//         maximumAngularSpeed: 2 * Math.PI,
//     }));
//     const targetRef = useRef(new Object3D());

//     useEffect(() => {
//         targetRef.current.position.set(0,0.5, 0.5);
//     }, [])

//     useFrame((state, dt) => {
//         const angles = armInverseKinematicsSolverRef.current.solve(targetRef.current.position.clone(), effectorState.pitch, effectorState.roll, effectorState.position, dt);
//         setAngles(angles);
//     });

    
//     return <>
//         <primitive object={targetRef.current}/>
//         <TransformControls object={targetRef.current} />
//     </>
// }

// export function ArmPlayground( /* : { angles: ArmState, setAngles : (newAngles : ArmState) => void, effectorState: EffectorState} */) {


//     const [ angles, setAngles ] = useState/* <ArmState> */({
//         rotunda: 0, // Rotunda
//         shoulder: 0, // Shoulder
//         elbow: 0, // Elbow
//         wristPitch: 0, // Wrist Pitch
//         wristRoll: 0, // Wrist Roll
//         effectorPosition: 0,
//       });
    
//     console.warn("The arm viewport is running in uncontrolled mode.\nThe component will provide its own control panel to control its state.");
//     // const [ effectorState, setEffectorState ] = useState/* <EffectorState> */({ pitch: 0, roll: 0, position: 0 });
//     const { pitch, roll, position } = useControls("Inverse Kinematics", {
//         effector: folder({
//             pitch: {
//                 value: 0,
//                 max: 90,
//                 min: -90,
//             },
//             roll: {
//                 value: 0,
//                 step: 1,
//             },
//             position: {
//                 value: 0,
//                 max: 40,
//                 min: -20,
//             }
//         })
//     });

//     return <Canvas
//             linear
//             camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
//             >
//         <Suspense fallback={<Loader/>}>
//             <SelectableBackground/>
//             <FollowingLight color={0xffffff} intensity={1} position={[0, 0, 1]}/>
//             <OrbitControls makeDefault/>
//             <ArmModel {...angles}/>
//             <ArmInverseKinematicsController setAngles={setAngles} effectorState={{
//                 pitch: pitch * DEG_TO_RAD,
//                 roll: roll * DEG_TO_RAD,
//                 position: position * DEG_TO_RAD
//             }}/>
//             <gridHelper/>
//         </Suspense>
// </Canvas>
// }

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
// DO SEND STUPID STUFF TO THESE COMPONENTS IG

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Vector3 } from "three";

import { OrbitControls, OrthographicCamera, TransformControls } from '@react-three/drei';
// import { ArmState, EffectorState } from "@/robot-types";
import { useArmModel } from "../util/models/arm";
import { Background, FollowingLight, Loader, SelectableBackground } from "../util/three-util-elements"
// import { useArm, useArmAngles, useDrive } from "../util/robot-state-util";
// import { useArmInputSystem } from "../util/input-system-util";
import { useAnimation, useWindowEvent } from "../util/hooks-util";
import { useChassiModel, useMountPoint, useSuspensionModel, useWheelModel } from "../util/models/robot";

import { interpolateHsl, interpolateRgb } from "d3";
import { DEG_TO_RAD, clamp, map } from "../util/math";
import { folder, useControls } from "leva";
import { ArmInverseKinematicsSolver } from "../util/inverse-kinematics";
import { Alert, Snackbar } from "@mui/material";

// Motor grey material
const defaultMotorMaterial = new MeshStandardMaterial({
    color: "#8B9094",
    metalness: 0,
    roughness: 1,
});    

// Color interpolator
const greenToRed = interpolateHsl("#00ff00", "#dd0000");

/**
 * Get the motor material given its current. Green if 0, Red if +-5, grey if its null.
 * @param {number} amount 
 * @returns {Material}
 */
function useMotorMaterial(amount) {
    const material = useRef(defaultMotorMaterial);

    if(amount == null) {
        material.current = defaultMotorMaterial;
    }else {
        // material.current = new MeshBasicMaterial({ color: greenToRed(amount), transparent: true, opacity: 0.9 });
        material.current = new MeshStandardMaterial({ 
            color: greenToRed(amount), 
            transparent: true, 
            opacity: 0.9
        });
    }
    return material.current;
}

/**
 * Use a material on a object
 * 
 * @param {Mesh} object 
 * @param {Material} material 
 */
function useMaterial(object, material) {
    useEffect(() => {
        object.material = material;
    }, [object, material]);
}

/**
 * Map current from 0 to 5 amps to 0 to 1
 * @param {number} current 
 * @returns {number}
 */
function mapCurrent(current) {
    if(current == null) return null;
    return clamp(map(Math.abs(current), 0, 5, 0, 1), 0, 1);
}

export function RobotModel({armState, ikTarget}) {
    
    const [
        chassi,
        suspensionMountPointFR,
        suspensionMountPointFL,
        suspensionMountPointB,
        rotundaMountPoint ] = useChassiModel();
    

    // const { feedback: armFeedback } = useArm();
    const armFeedback = null;

    // const { feedback: driveFeedback, wheelStates: simulatedWheelStates } = useDrive();
    
    
    const sus_angle = 0;
    // const fl = driveFeedback.motors.fl.steering.angle ?? simulatedWheelStates[0].angle, 
    //     fr = driveFeedback.motors.fr.steering.angle ?? simulatedWheelStates[1].angle, 
    //     b = driveFeedback.motors.b.steering.angle ?? simulatedWheelStates[2].angle;
    const fl = 0, fr = 0, b = 0;
    const driveFeedback = null;
    
    const [ suspensionFR, wheelMountPointFR ] = useSuspensionModel(suspensionMountPointFR, sus_angle);
    const [ suspensionB, wheelMountPointB ] = useSuspensionModel(suspensionMountPointB, sus_angle);
    const [ suspensionFL, wheelMountPointFL ] = useSuspensionModel(suspensionMountPointFL, sus_angle);
   
    const wheelFR = useWheelModel(wheelMountPointFR, -Math.PI/6 - Math.PI/2, -fr);
    const wheelB = useWheelModel(wheelMountPointB,  0, -b);
    const wheelFL = useWheelModel(wheelMountPointFL, Math.PI/6 + Math.PI/2, -fl);

    const arm = useArmModel(rotundaMountPoint, armState);
    
    const motorMaterials = {
        rotunda: useMotorMaterial(mapCurrent(armFeedback?.motors.rotunda.current)),
        shoulder: useMotorMaterial(mapCurrent(armFeedback?.motors.shoulder.current)),
        elbow: useMotorMaterial(mapCurrent(armFeedback?.motors.elbow.current)),
        wristLeft: useMotorMaterial(mapCurrent(armFeedback?.motors.wristLeft.current)),
        wristRight: useMotorMaterial(mapCurrent(armFeedback?.motors.wristRight.current)),

        fl: {
            steering: useMotorMaterial(mapCurrent(driveFeedback?.motors.fl?.steering.current)),
            propulsion: useMotorMaterial(mapCurrent(driveFeedback?.motors.fl?.propulsion.current)),
        },
        fr: {
            steering: useMotorMaterial(mapCurrent(driveFeedback?.motors.fr?.steering.current)),
            propulsion: useMotorMaterial(mapCurrent(driveFeedback?.motors.fr?.propulsion.current)),
        },
        b: {
            steering: useMotorMaterial(mapCurrent(driveFeedback?.motors.b?.steering.current)),
            propulsion: useMotorMaterial(mapCurrent(driveFeedback?.motors.b?.propulsion.current)),
        }
    }

    useMaterial(arm.motors.rotunda, motorMaterials.rotunda);
    useMaterial(arm.motors.shoulder, motorMaterials.shoulder);
    useMaterial(arm.motors.elbow, motorMaterials.elbow);
    useMaterial(arm.motors.wristLeft, motorMaterials.wristLeft);
    useMaterial(arm.motors.wristRight, motorMaterials.wristRight);

    useMaterial(wheelFL.motors.propulsion, motorMaterials.fl.propulsion);
    useMaterial(wheelFL.motors.steering, motorMaterials.fl.steering);
    useMaterial(wheelFR.motors.propulsion, motorMaterials.fr.propulsion);
    useMaterial(wheelFR.motors.steering, motorMaterials.fr.steering);
    useMaterial(wheelB.motors.propulsion, motorMaterials.b.propulsion);
    useMaterial(wheelB.motors.steering, motorMaterials.b.steering);

    // arm.add(ikTarget);
    useMountPoint(rotundaMountPoint, ikTarget);

    return <primitive object={chassi}/>
}

export function ArmModel(armState, /* : ArmState */) {
    const origin = useMemo(() => new Object3D(), []);
    const { arm } = useArmModel(origin, armState);
    return <primitive object={arm}/>
}

function ArmInverseKinematicsController({ target, enabled, position, setPosition }/*  : { position: Vector3, setPosition: (position:Vector3)=>void } */) {
    const targetRef = useRef(new Object3D());
    // // console.log(position);
    targetRef.current.position.copy(position);

    
    return <>
        <primitive object={target}/>
        <TransformControls enabled={enabled} object={target} onChange={() => {
            setPosition(target.position.clone());
        }} />
    </>
}


export function ArmOrthoView() {
    const camera = useRef();
    const controls = useRef();

    const [ angles, setAngles ] = useState({
        rotunda: 0,
        shoulder: 0,
        elbow: 0,
        wristRoll: 0,
        wristPitch: 0,
        effectorPosition: 0,
    });

    const { pitch, roll, position: effectorPosition } = useControls("Inverse Kinematics", {
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
                        max: 100,
                        min: 0,
                    }
                })
            });

    const mouseIn = useRef(false);
    useWindowEvent("keydown", (e) => {
        if(mouseIn.current) {
            if(e.key === "1") {
                camera.current.position.copy(controls.current.target);
                camera.current.position.setX(1);
                controls.current.update();
            }else if(e.key === "2") {
                camera.current.position.copy(controls.current.target);
                camera.current.position.setY(1);
                controls.current.update();
            }else if(e.key === "3") {
                camera.current.position.copy(controls.current.target);
                camera.current.position.setZ(1);
                controls.current.update();
            }
        }
    });

    const targetRef = useRef(new Object3D());
    // console.log(position);
    // targetRef.current.position.copy(ik.position);

    const armInverseKinematicsSolverRef = useRef(new ArmInverseKinematicsSolver({
                shoulderAbsolutePosition: new Vector3(0, 0.088, 0.085),
                shoulderLength: 0.457,
                elbowLength: 0.457,
                wristLength: 0.2,
                maximumSpeed: 0.5,
                // maximumAngularSpeed: 2 * Math.PI,
            }));

    const [outOfBounds, setOutOfBounds] = useState(false);

    useAnimation((dt) => {
        // console.log(targetRef.current.position.clone())
            const angles = armInverseKinematicsSolverRef.current.solve(position.clone(), pitch * DEG_TO_RAD, roll * DEG_TO_RAD, effectorPosition * DEG_TO_RAD, dt);
            // console.log(angles);
            setAngles(angles);
    });

    const [ position, setPosition ] = useState(new Vector3(0,0.5, 0.5));
    targetRef.current.position.copy(position);

    useEffect(() => {
        armInverseKinematicsSolverRef.current.goto(new Vector3(0,0.5, 0.5));
        // console.log(armInverseKinematicsSolverRef.current.current)
    }, []);
    
    return <div style={{width: "100%", height: "100%"}}>
        <Canvas
            linear
            camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 2]}}
            onPointerEnter={(e) => {
                mouseIn.current = true; 
                console.log("eneter");
            }}
            onPointerLeave={(e) => {
                mouseIn.current = false; 
            }}
            onKeyDown={(e) => {
                if(!e.repeat) {
                    if(e.key === "1") {
                        camera.current.position.copy(controls.current.target);
                        camera.current.position.setX(1);
                        controls.current.update();

                    }else if(e.key === "2") {
                        camera.current.position.copy(controls.current.target);
                        camera.current.position.setY(1);
                        controls.current.update();

                    }else if(e.key === "3") {
                        camera.current.position.copy(controls.current.target);
                        camera.current.position.setZ(1);
                        controls.current.update();

                    }
                }
            }}
        >
            <OrthographicCamera
                ref={camera}
                makeDefault
                near={-20}
                far={20}
                zoom={500}
                position={[0, 0, 1]}
            />
            <Suspense fallback={<Loader/>}>
                <Background/>
                <FollowingLight color={0xffffff} intensity={1} position={[0, 0, 1]}/>
                <OrbitControls ref={controls} makeDefault  />
                {/* <ArmModel {...angles}/> */}
                <RobotModel armState={angles} ikTarget={targetRef.current}/>
                <ArmInverseKinematicsController 
                    target={targetRef.current} 
                    enabled={true} 
                    position={position} 
                    solverRef={armInverseKinematicsSolverRef}
                    setOutOfBounds={setOutOfBounds}
                    setPosition={(pos) => {
                        const outOfBounds = armInverseKinematicsSolverRef.current.checkBounds(pos.clone(), pitch * DEG_TO_RAD, roll * DEG_TO_RAD, effectorPosition * DEG_TO_RAD)
                        setOutOfBounds(outOfBounds);
                        if(!outOfBounds){
                            setPosition(pos);
                        }
                    }}/>
                <gridHelper/>
            </Suspense>
    </Canvas>
            <Snackbar open={outOfBounds}>
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}>IK Solver out of bounds</Alert></Snackbar>
        </div>
}