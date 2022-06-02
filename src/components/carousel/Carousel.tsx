import React from "react";
import { FC, Key, ReactElement, RefObject, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { CarouselPropsI } from "./Carousel.types";

const ContainerDiv = styled.div`
    overflow-x: scroll;
    display: flex;
    flex-wrap: nowrap;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    scroll-snap-type: x mandatory;
    ::-webkit-scrollbar {
        display: none;
    }
`

const ItemDiv = styled.div`
    flex: none;
    width: 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
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

    const itemsLength: number = useMemo(() => items.length, [items])

    const index: number = useMemo(() => {
        if (Array.isArray(props.children) && selectedKey ) {
            return props.children?.findIndex(child => child.key === selectedKey)
        }
        return -1
    }, [props.children, selectedKey])

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
            setItems(props.children)
            setSelectedKey(props.children[0].key)
        }
    }, [props.children])

    useEffect(() => {
        if (props.selectedKey) setSelectedKey(props.selectedKey)
    }, [props.selectedKey])

    useEffect(() => {
        if (selectedKey) {
            containerDivRef.current?.scrollTo({left: selectedDivRef.current?.offsetLeft})
        }
    }, [selectedKey, containerDivRef, selectedDivRef])

    const selectPrev = () => {
        const prevItem = items[prevIndex]
        if (prevItem) setSelectedKey(prevItem.key)
    }

    useRefEvent(props.previousButtonRef, 'click', selectPrev)

    const selectNext = () => {
        const nextItem = items[nextIndex]
        if (nextItem) setSelectedKey(nextItem.key)
    }

    useRefEvent(props.nextButtonRef, 'click', selectNext)

    const handleContainerOnScrll = () => {
        if (containerDivRef.current?.scrollLeft === 0) return selectPrev()
        console.log(containerDivRef.current?.scrollLeft, nextDivRef.current?.offsetLeft)
        if (containerDivRef.current && nextDivRef.current && containerDivRef.current?.scrollLeft >= nextDivRef.current?.offsetLeft) return selectNext()
    }

    if (index !== -1) {
        return (
            <ContainerDiv
                ref={containerDivRef}
                onScroll={handleContainerOnScrll}
                style={{
                    
                }}
            >
                <ItemDiv>
                    {items[prevIndex]}
                </ItemDiv>
                <ItemDiv
                    ref={selectedDivRef}
                >
                    {items[index]}
                </ItemDiv>
                <ItemDiv
                    ref={nextDivRef}
                >
                    {items[nextIndex]}
                </ItemDiv>
            </ContainerDiv>
        )
    }
    return <>{props.children}</>
}

const useRefEvent = <K extends keyof HTMLElementEventMap>(ref: RefObject<HTMLElement> | undefined, event: K, handleEvent: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) => {
    useEffect(() => {
        const current = ref?.current
        if (current) {
            current.addEventListener(event, handleEvent)
            return () => {
                current.removeEventListener(event, handleEvent)
            }
        }
    }, [event, handleEvent, ref])
}