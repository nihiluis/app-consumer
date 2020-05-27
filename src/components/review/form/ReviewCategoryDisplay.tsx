import * as React from "react"

import { ProgressBar } from "polyvolve-ui/lib"
import { colorToStyle } from "../../../lib/color"
import { ReviewUserFormValues } from "."
import Criteria from "./Criteria"
import { User, ReviewCategory } from "polyvolve-ui/lib/@types";


import * as style from "../style.scss"

interface Props {
  user: User
  category: ReviewCategory
  values: ReviewUserFormValues
  setFieldValue: Function
  fieldArrayName: string
  show: boolean
  handleChange: (e: React.FocusEvent<any>) => void
  handleBlur: (e: React.FocusEvent<any>) => void
}

// This renders BOTH on mount, but then again when navigating between categories. BUG!
const ReviewCategoryDisplay: React.FunctionComponent<Props> = props => {
  const getProgress = () => {
    const { values, category } = props

    if (category.criteria.length === 0) return 100

    const categoryCriteria = category.criteria.map(criterion => criterion.id)

    let filledValuesForCategory = 0

    for (let key in values) {
      const value = values[key]

      if (!categoryCriteria.includes(key)) {
        continue
      }
      if (value !== 0 && !value) {
        continue
      }

      filledValuesForCategory += 1
    }

    return filledValuesForCategory / category.criteria.length * 100
  }

  const {
    category,
    values,
    setFieldValue,
    fieldArrayName,
    show,
    user,
    handleChange,
    handleBlur
  } = props
  const displayStyle = show ? {} : { display: "none" }

  return (
    <div key={`reviewCategory-container-${category.id}`} style={displayStyle}>
      <ProgressBar
        key={`reviewCategory-progressbar-${category.id}`}
        percent={getProgress()}
        className={style.reviewProgressBar} />
      <div key={`reviewCategory-div-${category.id}`} className={style.reviewCategoryContainer}>
        <div key={`reviewCategory-title-${category.id}`} className={style.title}>
          <h1>{category.name}</h1>
          <p className={style.descriptionText}>{category.description}</p>
        </div>
        <Criteria
          user={user}
          category={category}
          values={values}
          setFieldValue={setFieldValue}
          fieldArrayName={fieldArrayName}
          handleChange={handleChange}
          handleBlur={handleBlur} />
      </div>
    </div>
  )
}

export default ReviewCategoryDisplay
