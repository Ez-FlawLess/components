import { RefObject } from "react";

export interface SliderItemPropsI {
    position: 'static' | 'absolute',
    className?: string,
    divRef?: RefObject<HTMLDivElement>
}