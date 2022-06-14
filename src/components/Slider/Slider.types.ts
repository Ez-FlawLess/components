import { ReactElement, RefObject } from "react";

export interface SliderPropsI {
    children: ReactElement[],
    nextButtonRef?: RefObject<HTMLElement>,
    prevButtonRef?: RefObject<HTMLElement>,
}

export enum GoToE {
    next = 'next',
    prev = 'prev',
}