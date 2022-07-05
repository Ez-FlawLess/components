import React, { FC, useEffect, useMemo, useRef, useState, TouchEvent  } from "react";
import { SliderPropsI } from "./Slider.types";
import { css } from '@emotion/css'
import { useIsVisible } from "../../hooks/useIsVisible";
import useRefEvent from "../../hooks/useRefEvent";

export const Slider: FC<SliderPropsI> = props => {

    const containerDivRef = useRef<HTMLDivElement>(null)
    const firstDivRef = useRef<HTMLDivElement>(null)

    const firstCheckDivRef = useRef<HTMLDivElement>(null)
    const lastCheckDivRef = useRef<HTMLDivElement>(null)

    const [translateX, setTranslateX] = useState<number>(0)
    const [index, setIndex] = useState<number>(0)
    const [resetDuration, setResetDuration] = useState<boolean>(false)

    const [prevTouchPageX, setPrevTouchPageX] = useState<number>(0)

    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)

    const length = useMemo(() => props.children.length, [props.children])

    useRefEvent(props.prevButtonRef, 'click', () => {
        selectPrev()
    }, [index])

    useRefEvent(props.nextButtonRef, 'click', () => {
        selectNext()
    }, [index])

    const goToStart = () => {
        if (containerDivRef.current) {
            containerDivRef.current.style.transitionDuration = '0s'
            setIndex(0)
            setResetDuration(true)
        } 
    }

    const goToEnd = () => {
        if (containerDivRef.current) {
            containerDivRef.current.style.transitionDuration = '0s'
            setIndex(length - 1)
            setResetDuration(true)
        }
    }

    useIsVisible(firstCheckDivRef, () => {
        if (index === -1) goToEnd()
    }, [length, index, containerDivRef])

    useIsVisible(lastCheckDivRef, () => {
        if (index === length) goToStart()
    }, [length, index, containerDivRef])

    useEffect(() => {
        if (resetDuration && (index !== 0 && index !== length - 1) && containerDivRef.current) {
            containerDivRef.current.style.transitionDuration = '1s'
            setResetDuration(false)
        }
    }, [resetDuration, index, length])

    useEffect(() => {
        if (index > -1 && index < length && props.onSlide) props.onSlide(index)
    }, [index, props.onSlide, length])

    const selectNext = () => {
        if (index === length) goToStart()
        else setIndex(prev => prev + 1)
    }
    
    const selectPrev = () => {
        if (index === -1) goToEnd()
        else setIndex(prev => prev - 1)
    }

    const handleMouseDown = () => {
        if (containerDivRef.current) containerDivRef.current.style.transitionDuration = '0s'
        setMouseIsDown(true)
    }
    const handleMouseUp = () => {
        if (containerDivRef.current) containerDivRef.current.style.transitionDuration = '1s'
        if (translateX >= 30) setIndex(prev => prev - 1)
        else if (translateX <= -30) setIndex(prev => prev + 1)
        setTranslateX(0)
        setPrevTouchPageX(0)
        setMouseIsDown(false)
    }

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (prevTouchPageX) {
            const difference = e.touches[0].pageX - prevTouchPageX
            setTranslateX(prev => prev + difference)
        }
        setPrevTouchPageX(e.touches[0].pageX)
    }

    if (length <= 1) return <>{props.children}</>
    return (
        <div
            className={css`
                overflow: hidden;
                ${mouseIsDown ? 'cursor: grabbing !important;' : ''}
                img {
                    user-drag: none; 
                    user-select: none;
                    -moz-user-select: none;
                    -webkit-user-drag: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                }
            `}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={e => mouseIsDown && setTranslateX(prev => prev + e.movementX)}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
        >
            <div
                ref={containerDivRef}
                style={{
                    transitionProperty: 'transform',
                    transitionDuration: '1s',
                    transform: `translateX(calc(${-index}00% + ${translateX}px)`
                }}
                className={css`
                    position: relative;
                `}
            >
                <div 
                    ref={firstCheckDivRef}
                    className={css`
                        position: absolute;
                        right: calc(200% - 1px);
                        top: 0;
                        height: 100%;
                        width: 1px;
                        z-index: 10;
                    `}
                />
                <div
                    className={css`
                        position: absolute;
                        width: 100%;
                        top: 0;
                        right: 100%;
                    `}
                >
                    {props.children[length - 1]}
                </div>
                <div 
                    ref={firstDivRef}
                >
                    {props.children[0]}
                </div>
                {props.children.slice(1).map((child, index) => (
                    <div
                        key={child.key}
                        className={css`
                            position: absolute;
                            width: 100%;
                            top: 0;
                            left: ${index + 1}00%;
                        `}
                    >
                        {child}
                    </div>
                ))}
                <div
                    className={css`
                        position: absolute;
                        width: 100%;
                        top: 0;
                        left: ${length}00%;
                    `}
                >
                    {props.children[0]}
                </div>
                <div 
                    ref={lastCheckDivRef}
                    className={css`
                        position: absolute;
                        left: calc(${length + 1}00% - 1px);
                        top: 0;
                        height: 100%;
                        width: 1px;
                        z-index: 10;
                    `}
                />
            </div>
        </div>
    )
}