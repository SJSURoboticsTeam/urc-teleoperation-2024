import { useEffect, useRef } from "react";

/**
 * Use a window event. Will automatically remove the listener when event is changed.
 * 
 * @param {string} type 
 * @param {(this: Window, ev: Event)} listener 
 */
export function useWindowEvent/* <K extends keyof WindowEventMap> */(type/*  : K */, listener/* : (this: Window, ev: WindowEventMap[K]) => any */) {
    useEffect(() => {
        window.addEventListener(type, listener);
        return () => {
            window.removeEventListener(type, listener);
        }
    }, [type, listener]);
}

/**
 * Will manage calling `callback` in an animation frame if `enabled` is true.
 * @param {(dt:number) => void} callback 
 * @param {boolean} enabled 
 */
export function useAnimation(callback/*  : (dt : number) => void */, enabled = true) {
    const callbackRef = useRef(callback);
    const animationFrameRef = useRef(-1);
    callbackRef.current = callback;
    // const enabledRef = useRef(enabled);
    // enabledRef.current = enabled;
    useEffect(() => {
        if(enabled) {
            let then = 0;
            const update = (now/*  : number */) => {
                const dt = (now - then) * 0.001;
                then = now;
                if(dt < 1) {
                    callbackRef.current(dt);
                }

                // if(enabledRef.current) {
                    animationFrameRef.current = requestAnimationFrame(update);
                // }
            }
            animationFrameRef.current = requestAnimationFrame(update);
      
            return () => {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [enabled]);
}