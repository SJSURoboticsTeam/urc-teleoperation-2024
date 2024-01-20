/* eslint-disable react/prop-types */
import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { DirectionalLight, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";


export const Axis = {
    x: new Vector3(1, 0, 0),
    y: new Vector3(0, 1, 0),
    z: new Vector3(0, 0, 1),

    pitch: new Vector3(1, 0, 0),
    roll: new Vector3(0, 0, 1),
    yaw: new Vector3(0, 1, 0),
};

/**
 * Load and clone a gltf.
 * 
 * @param path Path to the gltf
 * @returns The base object of the gltf and its materials.
 */
export function useClonedGLTF(path /* : string */) /* : [Object3D, { [x:string] : MeshStandardMaterial }] */{
    const gltf = useLoader(GLTFLoader, path);

    return useMemo(() => {
        return [
            gltf.scene.children[0].clone(true) /* as Object3D */,
            gltf.materials /* as { [x:string] : MeshStandardMaterial } */,
        ];
    }, [gltf]);
}

/**
 * Find a three subobject.
 * 
 * @param object Object to get subobject of
 * @param key Name of object
 * @returns Subobject if it exists. null otherwise. Will warn if subobject doesn't exist.
 */
export function findThreeSubobject(object /* : Object3D */, key /* :string */) /* : Object3D|null */ {
    const subobject = object.children.find((child) => child.name === key);
    if(subobject == null) {
        console.error(key, " not found in ", object);
        return null;
    }else{
        return subobject;
    }
    
}

/**
 * Get and return a memo'ed three subobject.
 * 
 * @param object Object to get subobject of
 * @param name Name of object
 * @returns Subobject if it exists. Emtpy Object3D otherwise. Will warn if subobject doesn't exist.
 */
export function useThreeSubobject(object /* : Object3D */, name /* : string */) {
    return useMemo(() => findThreeSubobject(object, name) ?? new Object3D(), [object, name]);
}