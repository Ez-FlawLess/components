import { Key, ReactElement, RefObject } from "react";

export interface SliderPropsI {
    children: ReactElement[],
    nextButtonRef?: RefObject<HTMLElement>,
    prevButtonRef?: RefObject<HTMLElement>,
    onSlide?: (newIndex: number) => any,
}

export enum MoveDirE {
    next,
    prev,
}