import * as React from "react"

import { ReviewUserFormValues } from "."
import Criterion from "./Criterion"
import { Line } from "polyvolve-ui/lib"

import {
  ReviewCategory,
  ReviewCriterionType,
  User,
} from "polyvolve-ui/lib/@types"
import { reviewStyle } from "../../../lib/reexports"

interface Props {
  category: ReviewCategory
  user: User
  values: ReviewUserFormValues
  setFieldValue: Function
  fieldArrayName: string
  handleChange: (e: React.FocusEvent<any>) => void
  handleBlur: (e: React.FocusEvent<any>) => void
}

function mapValueToAnnotation(
  type: ReviewCriterionType,
  numberOfItems: number
): string[] {
  // TODO this is currently hardcoded, but should be dynamic later
  if (type === "scale") {
    if (numberOfItems === 7) {
      return [
        "Strongly disagree",
        "Disagree",
        "Slightly disagree",
        "Neutral",
        "Slightly agree",
        "Agree",
        "Strongly agree",
      ]
    }
  }

  return []
}

export default class ReviewUserCategoryCriteria extends React.Component<Props> {
  render(): JSX.Element {
    const {
      category,
      values,
      setFieldValue,
      fieldArrayName,
      user,
      handleChange,
      handleBlur,
    } = this.props

    const descriptionElements: JSX.Element[] = mapValueToAnnotation(
      "scale",
      7
    ).map(name => <p key={`reviewCriterionDescription-${name}`}>{name}</p>)

    // TODO this here is tricky and an unsolved design issue.
    // where do I put the radio bar description, if the criteria are mixed,
    // radioBar + association. is that allowed? I'd say no.
    return (
      <div className={reviewStyle.reviewCriterionContainer}>
        <Line className={reviewStyle.line} />
        {category.criteria.map((criterion, idx) => {
          const isFirstScaleCriterion =
            criterion.type === "scale" &&
            (idx === 0 || category.criteria[idx - 1].type !== "scale")

          return (
            <React.Fragment key={`criterion-fragment-${criterion.id}`}>
              {/*
              {isFirstScaleCriterion &&
                <div
                  key={`reviewCategory-radioBarContainer-${criterion.id}`}
                  className={reviewStyle.radioBarDescriptionContainer}>
                  <p key={`reviewCategory-radioBarContainer-${criterion.id}`}>Legend</p>
                  <div
                    key={`reviewCategory-description-${criterion.id}`}
                    className={reviewStyle.radioBarDescription}>
                    {descriptionElements}
                  </div>
                </div>}
                 */}
              <Criterion
                key={`criterion-${criterion.id}`}
                isLast={idx === category.criteria.length - 1}
                values={values}
                setFieldValue={setFieldValue}
                fieldArrayName={fieldArrayName}
                category={category}
                criterion={criterion}
                user={user}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </React.Fragment>
          )
        })}
        <Line className={reviewStyle.line} />
      </div>
    )
  }
}
