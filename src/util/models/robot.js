
import { Axis, useClonedGLTF, useThreeSubobject } from "../three-util";
import { useEffect } from "react";
// import { Object3D } from "three";

/**
 * Parent an object to another object, "Mounting it"
 * @param {Object3D} mountPoint 
 * @param {Object3D} mounted 
 */
export function useMountPoint(mountPoint /* : Object3D */, mounted /* : Object3D */) {
    useEffect(() => {
        mountPoint.add(mounted);
        return () => {
            mountPoint.remove(mounted);
        }
    }, [mountPoint, mounted]);
}

/**
 * 
 * @returns {[
 *      Object3D,
*      Object3D,
*      Object3D,
*      Object3D,
*      Object3D,
*      Object3D,
 * ]} Chassi, suspension mount point fr, suspension mount point fl, suspension mount point b, rotunda mount point and science mount point
 */
export function useChassiModel() {
    const [ chassi, materials ] = useClonedGLTF("/models/Chassi-High-Quality.glb");

    const suspensionMountPointFR = useThreeSubobject(chassi, "Suspension_Mount_Point_FR");
    const suspensionMountPointFL = useThreeSubobject(chassi, "Suspension_Mount_Point_FL");
    const suspensionMountPointb = useThreeSubobject(chassi, "Suspension_Mount_Point_B");

    const rotundaMountPoint = useThreeSubobject(chassi, "Rotunda_Mount_Point");
    const scienceMountPoint = useThreeSubobject(chassi, "Science_Mount_Point");

    return [
        chassi,
        suspensionMountPointFR,
        suspensionMountPointFL,
        suspensionMountPointb,

        rotundaMountPoint,
        scienceMountPoint,
    ];
}

/**
 * 
 * @param {Object3D} mountPoint Mount point
 * @param {number} angle Suspsension angle 
 * @returns {[ Object3D, Object3D]} Suspension model and wheel mount point
 */
export function useSuspensionModel(mountPoint /* : Object3D */, angle/*  : number */) {
    const [ suspension, materials ] = useClonedGLTF("/models/Suspension2-High-Quality.glb");
    
    useMountPoint(mountPoint, suspension);

    const lowerSuspension = useThreeSubobject(suspension, "Lower_Suspension_Joint");
    const wheelMountPoint = useThreeSubobject(lowerSuspension, "Wheel_Mount_Point");
    const upperSuspension = useThreeSubobject(suspension, "Upper_Suspension_Joint");
    const upperSuspensionSocket = useThreeSubobject(upperSuspension, "Upper_Socket_Joint");
    const shockUpper = useThreeSubobject(suspension, "Upper_Shock_Joint");
    const shockLower = useThreeSubobject(lowerSuspension, "Lower_Shock_Joint");

    // const shockSolve = useMemo(() => {
    //     const shockUpperAngleWithLinkage = Math.atan((shockUpper.position.z - lowerSuspension.position.z) / (shockUpper.position.y - lowerSuspension.position.y));
    //     const shockLowerAngleWithLinkage = Math.atan2(shockLower.position.y, shockLower.position.z);
    //     const shockLowerAngleWithLinkageCompliment = Math.PI/2 - shockLowerAngleWithLinkage;
    //     const a = shockUpper.position.clone().sub(lowerSuspension.position).length();
    //     const b = shockLower.position.length();
    //     console.log(shockLowerAngleWithLinkage, a, b, shockUpperAngleWithLinkage);
    
    //     return (theta /* : number */) => {
    //         const c = lawOfCosinesSide(Math.PI/2 + theta - shockLowerAngleWithLinkage - shockUpperAngleWithLinkage, a, b);
    //         const upperShockAngle = lawOfCosinesAngle(b, a, c);
    //         const lowerShockAngle = lawOfCosinesAngle(a, b, c);

    //         return [
    //             upperShockAngle - shockUpperAngleWithLinkage,
    //             // 0,
    //             Math.PI - (lowerShockAngle + shockLowerAngleWithLinkageCompliment),
    //         ];
    //     };
    // }, [ shockUpper, shockLower, lowerSuspension ]);

    // const linkageSolve =  useMemo(() => {
    //     const a = upperSuspension.position.clone().sub(lowerSuspension.position).length();
    //     const b = upperSuspensionSocket.position.length();
    //     const c = 0.064; // From Wheel
    //     const d = wheelMountPoint.position.length();
        
    //     const initialAngle = Math.PI / 2;
        
    //     const solve = createFourbarLinkageSolver(a, b, c, d);

    //     return (theta /* : number */) => {
    //         const [ a, b, c, d ] = solve(-theta + initialAngle);
    //         return [
    //             theta,
    //             b - Math.PI/2,
    //             c,
    //             d - Math.PI/2,
    //         ]
    //     }
    // }, [ upperSuspension, lowerSuspension, upperSuspensionSocket, wheelMountPoint ]);
    
    // const linkages = linkageSolve(angle);
    
    // lowerSuspension.setRotationFromAxisAngle(Axis.pitch, angle);
    // upperSuspension.setRotationFromAxisAngle(Axis.pitch, angle);
    // wheelMountPoint.setRotationFromAxisAngle(Axis.pitch, -linkages[3]);

    // const [ upperShockAngle, lowerShockAngle ] = shockSolve(angle);
    // shockUpper.setRotationFromAxisAngle(Axis.pitch, Math.PI/2-upperShockAngle);
    // shockLower.setRotationFromAxisAngle(Axis.pitch, -lowerShockAngle);
    
    return [
        suspension,
        wheelMountPoint
    ];
}

/**
 * 
 * @param {Object3D} mountPoint 
 * @param {number} offset 
 * @param {number} angle 
 * @returns {{
 *      wheel: Object3D,
 *      materials: Material[],
 *      motors: {
 *          steering: Object3D,
 *          propulsion: Object3D
 *      }
 * }} Wheel and motors
 */
export function useWheelModel(mountPoint/* : Object3D */, offset /* : number */, angle /* : number */) {
    const [ wheel, materials ] = useClonedGLTF("/models/Wheel2-High-Quality.glb");
    useMountPoint(mountPoint, wheel);

    const steeringAxis = useThreeSubobject(wheel, "Steering_Axis");

    steeringAxis.setRotationFromAxisAngle(Axis.yaw, offset + angle);

    return { 
        wheel, 
        materials,
        motors: {
            steering: useThreeSubobject(wheel, "Steering_Motor"),
            propulsion: useThreeSubobject(steeringAxis, "Propulsion_Motor"),
        }
    };
}