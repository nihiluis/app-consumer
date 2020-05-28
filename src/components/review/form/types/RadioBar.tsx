import * as React from "react"
import { ReviewCriterionType } from "polyvolve-ui/lib/@types"
import { reviewStyle } from "../../../../lib/reexports"

// ReviewRadioBar idea: create 10
interface Props {
  value: number
  type: ReviewCriterionType
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
            onChange={e => onChange(parseFloat(e.currentTarget.value))}
            style={{ width: `${100 / numberOfItems}%` }}
          />
          <span />
        </label>
      )

      let className: string
      if (i + 1 <= 0.3 * numberOfItems) {
        className = reviewStyle.radioBarNegative
      } else if (i + 1 >= 0.75 * numberOfItems) {
        className = reviewStyle.radioBarPositive
      }
      colorElements.push(
        <div
          key={`radio-color-element-${i}`}
          className={className}
          style={{ width: `${100 / numberOfItems}%` }}
        />
      )
    }

    return (
      <div key={`radioBarContainer`} className={reviewStyle.radioBarContainer}>
        <div key={`radioBar`} className={reviewStyle.radioBar}>
          {radioElements}
        </div>
        <div key={`radioBarInfo`} className={reviewStyle.radioBarInfo}>
          {colorElements}
        </div>
      </div>
    )
  }
}
