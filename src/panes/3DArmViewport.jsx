/* eslint-disable react/prop-types */
// No idea what prop-types is or why its yelling at me. - Andrew Lin

"use client"
import { useEffect, useRef } from "react";
import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, Object3D, Vector3, GridHelper } from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * There is a lot of funky stuff going on here.
 * The three.js scene is effectively seperate from the react runtime.
 * The scene attempts to render each frame and 60 fps.
 * React will update the angles of each arm mesh, but the change
 * will only be reflected in the next frame.
 * All information between the scene (which is a react ref) and react
 * must be manually synchronized together.
 * 
 * This component is not "reactive" in the react sense.
 */
class ArmViewportScene {

    // Typescript definitions + Some explanation of what each variable should correspond to.

    // // Dimensions of the viewport
    // width: number;
    // height: number;

    // scene: Scene;
    // camera: PerspectiveCamera;
    // renderer: WebGLRenderer; 

    // controls: OrbitControls; // The mouse controls

    // // Mesh objects
    // armBase: Object3D; // Rotunda
    // hindArm: Object3D; // Shoulder
    // foreArm: Object3D; // Elbow
    // foreWrist: Object3D; // Wrist Pitch
    // hindWrist: Object3D; // Wrist Roll

    // grid: GridHelper;

    // // Lights
    // mainLight: DirectionalLight;

    // // Canvas Element
    // canvas: HTMLCanvasElement;
    
    /**
     * Initializes the scene.
     * 
     * @param canvas Canvas to render on
     */
    constructor(canvas /* : HTMLCanvasElement */) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        this.scene = new Scene();
        
        this.renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        this.renderer.setClearAlpha(0.0);
        this.renderer.setSize(this.width, this.height);
        

        this.camera = new PerspectiveCamera( 75, this.width / this.height, 0.1, 1000);
        this.camera.position.set( 2, 2, 2 );
        this.scene.add(this.camera);

        // Set up mouse controls.
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.update();


        // White light intensity 5.
        this.mainLight = new DirectionalLight(0xffffff, 5.0);
        // Make it point in the direction of the camera view.
        this.mainLight.position.set(0, 0, 1);
        this.camera.add(this.mainLight);


        // Add a grid
        this.grid = new GridHelper(10, 10);
        this.grid.position.set(0, -1, 0);
        this.scene.add(this.grid);
        
        
        // Load the model
        this.armBase = new Object3D();
        this.hindArm = new Object3D();
        this.foreArm = new Object3D();
        this.foreWrist = new Object3D();
        this.hindWrist = new Object3D();
        const loader = new GLTFLoader();
        loader.load("/models/arm.glb", (gltf) => {
            // this.arm = gltf.scene;
            // Extract the correct parent elements from the mesh.
            this.armBase = gltf.scene.children[0];

            this.hindArm = this.armBase.children.find((child) => child.name === "Hind_Arm") ?? this.hindArm;
            this.foreArm = this.hindArm.children.find((child) => child.name === "Fore_Arm") ?? this.foreArm;
            this.hindWrist = this.foreArm.children.find((child) => child.name === "Upper_Wrist") ?? this.hindWrist;
            this.foreWrist = this.hindWrist.children.find((child) => child.name === "Lower_Wrist") ?? this.foreWrist;

            // console.log(this.armBase, this.hindArm, this.foreArm, this.foreWrist, this.hindWrist);

            this.armBase.position.set(0,-1,0);
            this.armBase.scale.set(1, 1, 1)

            this.scene.add(this.armBase);
        });
    }

    /**
     * Update the scene with the new dimensions.
     * @param width New width of the viewport
     * @param height New height of the viewport
     */
    // setSize(width : number, height : number) {
    setSize(width, height) {
        // Update elements
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;

        // Update Renderer
        this.renderer.setSize(width, height);

        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Set the arm mesh positions.
     * 
     * @param armBaseAngle Radians
     * @param hindArmAngle Radians
     * @param foreArmAngle Radians
     * @param foreWristAngle Radians
     * @param hindWristAngle Radians
     * @param clawPosition Radians
     */
    // setArmPositions(armBaseAngle: number, hindArmAngle: number, foreArmAngle: number, hindWristAngle: number, foreWristAngle: number, clawPosition: number) {
    setArmPositions(armBaseAngle, hindArmAngle, foreArmAngle, hindWristAngle, foreWristAngle, clawPosition) {
        this.armBase.setRotationFromAxisAngle(new Vector3(0, 1, 0), armBaseAngle);
        this.hindArm.setRotationFromAxisAngle(new Vector3(1, 0, 0), hindArmAngle);
        this.foreArm.setRotationFromAxisAngle(new Vector3(1, 0, 0), foreArmAngle);
        this.hindWrist.setRotationFromAxisAngle(new Vector3(1, 0, 0), hindWristAngle);
        this.foreWrist.setRotationFromAxisAngle(new Vector3(0, 0, 1), foreWristAngle);
    }

    /**
     * Render a frame
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    cleanup() {
        
    }
}


/**
 * Calls a render function at each animation frame.
 * @param render dt is the difference time since last frame, in seconds.
 */
function useRenderLoop(render /* : (dt : number) => void */) {
    useEffect(() => {
        let frame = 0;

        let then = 0;
        let loop = (now /* : number */) => {
            const dt = (now - then) / 1000; 
            then = now;
            render(dt);

            frame = requestAnimationFrame(loop);
        };

        frame = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(frame);
        };
    });
}


// Type Script Stuff.
// These are what each argument corresponds to.

// interface ArmViewportArgs {
//     armBaseAngle : number; // Rotunda
//     foreArmAngle : number; // Shoulder
//     hindArmAngle : number; // Elbow
//     foreWristAngle : number; // Wrist Pitch
//     hindWristAngle : number; // Wrist Roll
// };

export function ArmViewport({ armBaseAngle=0, hindArmAngle=0, foreArmAngle=0, hindWristAngle=0, foreWristAngle=0 } /* : ArmViewportArgs */) {
    const divRef = useRef/* <HTMLDivElement|null> */(null);
    const canvasRef = useRef/* <HTMLCanvasElement|null> */(null);
    const sceneRef = useRef/* <ArmViewportScene|null> */(null);

    useEffect(() => {
        if(canvasRef.current != null && divRef.current != null) {
            // Initialize the scene.
            sceneRef.current = new ArmViewportScene(canvasRef.current);

            // This will update the canvas and scene whenever it is resized.
            new ResizeObserver(() => {
                if(divRef.current != null && sceneRef.current != null) {
                    sceneRef.current.setSize(divRef.current.clientWidth, divRef.current.clientHeight* 0.999);
                }
            }).observe(divRef.current);
        }
    // These are refs that should be populated before the component is mounted (i.e. not null before this effect runs).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render scene every animation frame.
    useRenderLoop((dt) => {
        if(sceneRef.current) {
            sceneRef.current.render();
        }
    });


    if(sceneRef.current != null) {
        sceneRef.current.setArmPositions(armBaseAngle, hindArmAngle, foreArmAngle, hindWristAngle, foreWristAngle, 0);
    }

    return <div ref={divRef} style={{height: "100%", width: "100%"}}>
            <canvas ref={canvasRef} style={{height: "100%", width: "100%"}}></canvas>
        </div>
}