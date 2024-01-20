/* eslint-disable react/prop-types */
import { Environment, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { DirectionalLight } from "three";

/**
 * A small little background selector.
 * 
 * @returns Environment Element
 */
export function SelectableBackground() {
    const { background, blur, showBackground } = useControls("Background", {
        background: {
            options: [
                "cyclorama_2k",
                "sunset_1k",
                "sunset_2k",
                "studio_1k",
                "studio_2k",
                "puresky_2k",
            ]
        },
        showBackground: true,
        blur: {
            value: 0.5,
            min: 0,
            max: 1,
        }
    })

    return <Environment files={`/env/${background}.hdr`} blur={blur} background={showBackground} />;
}

/**
 * Loading animation
 * @returns 
 */
export function Loader() {
    // const { progress } = useProgress()
    return <Html center>Loading...</Html>
}


/**
 * Create a following directional light. This light is always in the same position relative to the camera.
 * WARNING: ONLY ONE FOLLOWING LIGHT IS CREATABLE AT THIS TIME.
 * 
 * @param param0 
 *      color - color of the light
 *      intensity - intensity of the light
 *      position - position of the light relative to the camera
 * @returns Returns null. While this is a jsx object, it does not render any thing to the tree.
 */
export function FollowingLight({ color, intensity, position } /* : { color?:ColorRepresentation, intensity?:number, position?:Vector3Tuple } */) {
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
