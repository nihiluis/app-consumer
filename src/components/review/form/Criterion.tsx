import * as React from "react"

import { ReviewUserFormValues } from "."
import RadioBar from "./types/RadioBar"
import { Line } from "polyvolve-ui/lib"
import { ReviewCriterion, ReviewCategory, User } from "polyvolve-ui/lib/@types"
import {
  getUserName,
  getUserHimself,
  getUserHe,
} from "polyvolve-ui/lib/utils/User"
import { reviewStyle } from "../../../lib/reexports"

interface Props {
  user: User
  criterion: ReviewCriterion
  category: ReviewCategory
  isLast: boolean
  values: ReviewUserFormValues
  handleChange: (e: React.FocusEvent<any>) => void
  handleBlur: (e: React.FocusEvent<any>) => void
  setFieldValue: Function
  fieldArrayName: string
}

export default class ReviewUserCategoryCriterion extends React.Component<
  Props
> {
  render(): JSX.Element {
    const { criterion } = this.props

    if (criterion.type === "scale") {
      return this.renderScale()
    } else if (criterion.type === "text") {
      return this.renderText()
    } else {
      return null
    }
  }

  getCriterionDescription = (): string => {
    const { criterion, user } = this.props

    return criterion.description
      .replace("{user}", getUserName(user))
      .replace("{himself}", getUserHimself(user))
      .replace("{he}", getUserHe(user))
  }

  renderScale(): JSX.Element {
    const { criterion, isLast, values, setFieldValue } = this.props

    return (
      <React.Fragment>
        <div
          key={`reviewCriterion-div-${criterion.id}`}
          className={reviewStyle.reviewCriterion}>
          <div>
            <h3 className="mb06">{criterion.name}</h3>
            <h4>{this.getCriterionDescription()}</h4>
          </div>
          <RadioBar
            key={`reviewCriterion-radioBar-${criterion.id}`}
            type="scale"
            numberOfItems={7}
            value={values[criterion.id]}
            onChange={newValue => {
              setFieldValue(`[${criterion.id}]`, newValue)
            }}
          />
        </div>
        {!isLast && <Line className={reviewStyle.lineCriterion} />}
      </React.Fragment>
    )
  }

  renderText(): JSX.Element {
    const {
      criterion,
      category,
      isLast,
      values,
      setFieldValue,
      handleBlur,
      handleChange,
    } = this.props

    return (
      <React.Fragment>
        <div
          key={`reviewCriterion-div-${criterion.id}`}
          className={reviewStyle.reviewCriterion}>
          <div>
            <h3>{criterion.name}</h3>
            <p>{this.getCriterionDescription()}</p>
          </div>
          <textarea
            name={`[${criterion.id}]`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[criterion.id]}
          />
        </div>
        {!isLast && <Line className={reviewStyle.lineCriterion} />}
      </React.Fragment>
    )
  }
}
