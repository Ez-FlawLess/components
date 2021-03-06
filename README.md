# components

- [Slider](#Slider)

## Slider

A slideshow component for cycling through elements—images or slides of text—like a carousel.

### How it works

It accepts an array of React Elements as children. It only renders the active element and two elements next to it.

### Usage

```javascript
const nextSlideButtonRef = useRef<HTMLButtonElement>(null)
const prevSlideButtonRef = useRef<HTMLButtonElement>(null)

const [key, setKey] = useState<Key | null>(null)
const [items, setItems] = useState<number[]>([1,2,3,4,5])

return (
    <div style={{position: 'relative'}}>
        <button ref={nextSlideButtonRef} style={{position: 'absolute', top: 50, right: 0,}}>Next</button>
        <button ref={prevSlideButtonRef} style={{position: 'absolute', top: 50, left: 0,}}>prev</button>
        <Slider
          nextButtonRef={nextSlideButtonRef}
          prevButtonRef={prevSlideButtonRef}
          onSlide={(newKey: SetStateAction<Key | null>, newIndex: any) => setKey(newKey)}
        >
        {items.map(item => (
            <div key={item}>
                {item}
            </div>
        ))}
        </Slider>
        <div style={{display: 'flex'}}>
          {items.map((item, index) => (
              <h6 key={item} style={{color: item === key ? 'red' : 'black'}}>
                {index + 1}
              </h6>
          ))}
        </div>
    </div>
)
```
