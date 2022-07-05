import React, { FC, Key, useEffect, useMemo, useRef, useState, TouchEvent } from "react";
import { GoToE, SliderPropsI } from "./Slider.types";
import { css } from '@emotion/css'
import { SliderItem } from "./SliderItem/SliderItem";
import useTimeout from "../../hooks/useTimeout";
import useRefEvent from "../../hooks/useRefEvent";

export const Slider: FC<SliderPropsI> = props => {

    const prevDivRef = useRef<HTMLDivElement>(null)
    const selectedDivRef = useRef<HTMLDivElement>(null)

    const [selectedKey, setSelectedKey] = useState<Key>('')
    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
    const [translateX, setTranslateX] = useState<number>(0)
    const [transitionDuration, setTransitionDuration] = useState<number>(0)
    const [goTo, setGoTo] = useState<GoToE | null>(null)
    const [prevTouchPageX, setPrevTouchPageX] = useState<number>(0)

    const childrenLength = useMemo(() => props.children.length, [props.children])

    const selectedIndex = useMemo<number>(() => props.children.findIndex(comp => comp.key === selectedKey), [selectedKey])
    const prevIndex: number = useMemo<number>(() => selectedIndex === 0 ? childrenLength - 1 : selectedIndex - 1, [selectedIndex, childrenLength])
    const nextIndex: number = useMemo<number>(() => selectedIndex === childrenLength - 1 ? 0 : selectedIndex + 1, [selectedIndex, childrenLength])

    useEffect(() => {
        if (!selectedKey && props.children[0]?.key) setSelectedKey(props.children[0].key)
    }, [props.children, selectedKey])

    useEffect(() => {
        if (props.onSlide) props.onSlide(selectedKey, selectedIndex)
    }, [props.onSlide, selectedKey, selectedIndex])

    useTimeout(() => {
        setTransitionDuration(0)
        setSelectedKey(props.children[goTo === GoToE.next ? nextIndex : prevIndex].key || '')
        setTranslateX(0)
        setGoTo(null)
    }, transitionDuration, [transitionDuration, goTo, props.children])

    useRefEvent(props.prevButtonRef, 'click', () => {
        setTransitionDuration(1500)
        goToPrev()
    }, [selectedDivRef])

    useRefEvent(props.nextButtonRef, 'click', () => {
        setTransitionDuration(1500)
        goToNext()
    }, [prevDivRef])

    const goToPrev = () => {
        setTranslateX(selectedDivRef.current?.clientWidth || 0)
        setGoTo(GoToE.prev)
    }

    const goToNext = () => {
        setTranslateX(-(prevDivRef.current?.clientWidth || 0))
        setGoTo(GoToE.next)
    }

    const handleMouseDown = () => {
        setMouseIsDown(true)
    }

    const handleMouseUp = () => {
        if (mouseIsDown) {
            if (translateX <= 30 && translateX >= -30) {
                setTranslateX(0)
                setTransitionDuration(500)
            } else {
                setTransitionDuration(1000)
                if (translateX > 30) goToPrev()
                else goToNext()
            }
        }
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

    if (childrenLength > 1) return (
        <div
            className={css`
                overflow: hidden;
            `}
        >
            <div
                className={css`
                    width: 100%;
                    position: relative;
                    transform: translateX(${translateX}px);
                    transition-duration: ${transitionDuration}ms;
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
                <SliderItem 
                    divRef={prevDivRef}
                    position="absolute" 
                    className={`
                        right: 100%;
                    `}
                >
                    {props.children[prevIndex]}
                </SliderItem>
                <SliderItem 
                    divRef={selectedDivRef}
                    position="static"
                >
                    {props.children[selectedIndex]}
                </SliderItem>
                <SliderItem 
                    position="absolute"
                    className={`
                        left: 100%;
                    `}
                >
                    {props.children[nextIndex]}
                </SliderItem>
            </div>
        </div>
    )
    return (
        <>
            {props.children}
        </>
    )
}