import { DependencyList, RefObject, useEffect } from "react"

const useRefEvent = <K extends keyof HTMLElementEventMap>(ref: RefObject<HTMLElement> | undefined, event: K, handleEvent: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, dep: DependencyList = []) => {
    useEffect(() => {
        const current = ref?.current
        if (current) {
            current.addEventListener(event, handleEvent)
            return () => {
                current.removeEventListener(event, handleEvent)
            }
        }
    }, [event, handleEvent, ref, ...dep])
}

export default useRefEvent