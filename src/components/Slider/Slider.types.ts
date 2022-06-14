import { Key, ReactElement, RefObject } from "react";

export interface SliderPropsI {
    children: ReactElement[],
    nextButtonRef?: RefObject<HTMLElement>,
    prevButtonRef?: RefObject<HTMLElement>,
    onSlide?: (newKey: Key, newIndex: number) => any,
}

export enum GoToE {
    next = 'next',
    prev = 'prev',
}