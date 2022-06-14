import React, { FC, PropsWithChildren } from "react";
import { SliderItemPropsI } from "./SliderItem.types";
import { css } from '@emotion/css'

export const SliderItem: FC<PropsWithChildren<SliderItemPropsI>> = props => {
    return (
        <div
            ref={props.divRef}
            className={css`
                width: 100%;
                position: ${props.position};
                overflow: hidden;
                top: 0;
                ${props.className}
            `}
            draggable={false}
        >
            {props.children}
        </div>
    )
}

SliderItem.defaultProps = {
    className: '',
}