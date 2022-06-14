import React from "react";
import { FC, Key, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { css } from '@emotion/css'
import useRefEvent from "../../hooks/useRefEvent";
import useTimeout from "../../hooks/useTimeout";
import { CarouselPropsI } from "./Carousel.types";
import { useWindowResize } from "../../hooks/useWindowResize";

const itemDivClassName = css`
    display: flex;
    justify-content: center;
    items-align: center;
`

export const Carousel: FC<CarouselPropsI> = props => {

    const containerDivRef = useRef<HTMLDivElement>(null)
    const selectedDivRef = useRef<HTMLDivElement>(null)
    const nextDivRef = useRef<HTMLDivElement>(null)

    const [items, setItems] = useState<ReactElement[]>([])
    const [selectedKey, setSelectedKey] = useState<Key | null>(null)

    const [width, setWidth] = useState<number>(0)

    const itemsLength: number = useMemo(() => items.length, [items])

    const index: number = useMemo(() => {
        if (selectedKey ) {
            return items.findIndex(child => child.key === selectedKey)
        }
        return -1
    }, [items, selectedKey])

    const prevIndex: number = useMemo(() => {
        if (index === 0) return itemsLength - 1
        return index - 1
    }, [itemsLength, index]) 

    const nextIndex: number = useMemo(() => {
        if (index === itemsLength - 1) return 0
        return index + 1
    }, [itemsLength, index])

    useEffect(() => {
        if (Array.isArray(props.children) && props.children[0]) {
            setItems(props.dir === 'rtl' ? props.children.reverse() : props.children)
        }
    }, [props.children, props.dir])

    useEffect(() => {
        if (!selectedKey && items.length) setSelectedKey(items[0].key)
    }, [items, selectedKey])

    useEffect(() => {
        if (props.selectedKey) setSelectedKey(props.selectedKey)
    }, [props.selectedKey])

    useEffect(() => {
        if (selectedKey) {
            containerDivRef.current?.scrollTo({left: selectedDivRef.current?.offsetLeft})
        }
    }, [selectedKey, containerDivRef, selectedDivRef])

    useEffect(() => {
        if (props.onSlide && selectedKey) props.onSlide(selectedKey, index)
    }, [props.onSlide, index, selectedKey])
    
    useEffect(() => {
        console.log('selected div', selectedDivRef.current?.scrollWidth)
        setWidth(selectedDivRef.current?.scrollWidth ?? 0)
    }, [selectedDivRef, index])

    useWindowResize(() => {
        setWidth(selectedDivRef.current?.clientWidth ?? 0)
    }, [selectedDivRef])

    const scrollToPrev = () => {
        containerDivRef.current?.scrollTo({left: 0, behavior: 'smooth'})
    }

    const scrollToNext = () => {
        containerDivRef.current?.scrollTo({left: containerDivRef.current.scrollWidth, behavior: 'smooth'})
    }

    useRefEvent(props.previousButtonRef, 'click', () => {
        if (props.dir === 'rtl') scrollToNext()
        else scrollToPrev()
    }, [props.dir])

    useRefEvent(props.nextButtonRef, 'click', () => {
        if (props.dir === 'rtl') scrollToPrev()
        else scrollToNext()
    }, [props.dir])

    useTimeout(scrollToNext, props.intervalTimer, [props.intervalTimer, selectedKey, containerDivRef])

    const selectPrev = () => {
        // const prevItem = items[prevIndex]
        // if (prevItem) setSelectedKey(prevItem.key)
    }

    const selectNext = () => {
        // const nextItem = items[nextIndex]
        // if (nextItem) setSelectedKey(nextItem.key)
    }

    const handleContainerOnScrll = () => {
        console.log('on scroll container','scroll left', containerDivRef.current?.scrollLeft, 'scroll width', containerDivRef.current?.scrollWidth )
        if (containerDivRef.current?.scrollLeft === 0) return selectPrev()
        if (containerDivRef.current && nextDivRef.current && containerDivRef.current?.scrollLeft >= nextDivRef.current?.offsetLeft) return selectNext()
    }

    if (index !== -1) {
        return (
            <div
                className={css`
                    overflow-x: scroll;    
                    width: ${width ? (width + 'px') : '100%'};
                `}
                dir="ltr"
                ref={containerDivRef}
                onScroll={handleContainerOnScrll}
            >
                <div
                    className={css`
                        position: relative;
                    `}
                >
                    <div className={itemDivClassName}>
                        {items[prevIndex]}
                    </div>
                    <div
                        className={itemDivClassName + ' ' + css`
                            position: absolute;
                            top: 0;
                            left: 100%;
                        `}
                        ref={selectedDivRef}
                    >
                        {items[index]}
                        <div
                        className={itemDivClassName + ' ' + css`
                            position: absolute;
                            top: 0;
                            left: 100%;
                        `}
                            ref={nextDivRef}
                        >
                            {items[nextIndex]}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return <>{props.children}</>
}