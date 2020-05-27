import * as React from "react"
import { ReviewType } from "../../../../lib/review"

import * as style from "../../style.scss"

// ReviewRadioBar idea: create 10 
interface Props {
  value: number
  type: ReviewType
  numberOfItems: number
  showDescriptions?: boolean
  onChange: (value: number) => void
}

export default class RadioBar extends React.Component<Props> {
  render(): JSX.Element {
    const { value, onChange, numberOfItems, type } = this.props

    if (type === "scale") {
      if (numberOfItems !== 7) {
        console.error("Currently RadioBar only supports a 7 scale, sorry.")
        return null
      }
    }

    const radioElements: JSX.Element[] = []
    const colorElements: JSX.Element[] = []

    for (let i = 0; i < numberOfItems; i++) {
      radioElements.push(
        <label key={`radio-label-${i}`}>
          <input
            key={`radio-${i}`}
            type="radio"
            value={i}
            checked={value === i}
            onChange={(e) => onChange(parseFloat(e.currentTarget.value))}
            style={{ width: `${100 / numberOfItems}%` }} />
          <span />
        </label>
      )

      let className: string
      if (i + 1 <= 0.3 * numberOfItems) {
        className = style.radioBarNegative
      } else if (i + 1 >= 0.75 * numberOfItems) {
        className = style.radioBarPositive
      }
      colorElements.push(
        <div
          key={`radio-color-element-${i}`}
          className={className}
          style={{ width: `${100 / numberOfItems}%` }} />
      )
    }

    return (
      <div key={`radioBarContainer`} className={style.radioBarContainer}>
        <div key={`radioBar`} className={style.radioBar}>
          {radioElements}
        </div>
        <div key={`radioBarInfo`} className={style.radioBarInfo}>
          {colorElements}
        </div>
      </div>
    )
  }
}
