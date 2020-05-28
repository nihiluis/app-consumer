import * as React from "react"
import { FieldArray } from "formik"
import {
  ReviewSchema,
  User,
  ReviewUserValueContainer,
} from "polyvolve-ui/lib/@types"
import { ReviewUserFormValues } from "."
import ReviewCategoryDisplay from "./ReviewCategoryDisplay"

import { Error, Button } from "polyvolve-ui/lib"
import { NextIcon, BackIcon } from "polyvolve-ui/lib/icons"
import { reviewStyle } from "../../../lib/reexports"

interface Props {
  user: User
  reviewUser: ReviewUserValueContainer
  saveError: string
  page: number
  maxPage: number
  switchPage: (page: number) => void
  activeUserIdx: number
  users: User[]
  handleSubmit: any
  schema: ReviewSchema
  values: ReviewUserFormValues
  setFieldValue: any
  handleBlur: (e: React.FocusEvent<any>) => void
  handleChange: (e: React.FocusEvent<any>) => void
}

export default class ReviewUserForm extends React.Component<Props> {
  componentDidUpdate(oldProps: Props) {
    const newProps = this.props

    if (oldProps.reviewUser !== newProps.reviewUser) {
      this.updateValuesOnReviewUserChange(newProps)
    }
  }

  updateValuesOnReviewUserChange = (props: Props) => {
    const { reviewUser, setFieldValue, schema } = props

    const updatedCriteria = []
    reviewUser.values.forEach(value => {
      updatedCriteria.push(value.criterion.id)
      setFieldValue(value.criterion.id, value.value.value)
    })

    schema.categories
      .flatMap(category => category.criteria)
      .forEach(criterion => {
        if (!updatedCriteria.includes(criterion.id)) {
          setFieldValue(criterion.id, "")
        }
      })
  }

  render() {
    const {
      user,
      schema,
      saveError,
      page,
      maxPage,
      switchPage,
      handleSubmit,
      handleBlur,
      handleChange,
      values,
      setFieldValue,
    } = this.props

    const hasPreviousPage = page > 1 && maxPage > 1
    const hasNextPage = page < maxPage && maxPage > 1

    return (
      <form onSubmit={handleSubmit} className={reviewStyle.form}>
        <FieldArray
          name="reviewUser"
          render={() =>
            schema.categories.map((category, idx) => (
              <ReviewCategoryDisplay
                key={`reviewCategory-${category.id}`}
                user={user}
                category={category}
                fieldArrayName={"reviewUser"}
                values={values}
                show={page === idx + 1}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            ))
          }
        />
        <div className={reviewStyle.pageNavOuter}>
          {hasPreviousPage && (
            <BackIcon
              onClick={() => switchPage(page - 1)}
              size={{ width: 16, height: 16 }}
            />
          )}
          {!hasPreviousPage && <div style={{ width: 16 }} />}
          <p>
            {page}/{maxPage}
          </p>
          {hasNextPage && (
            <NextIcon
              onClick={() => switchPage(page + 1)}
              size={{ width: 16, height: 16 }}
            />
          )}
          {!hasNextPage && <div style={{ width: 16 }} />}
        </div>
        {saveError && <Error>Unable to save due to {saveError}</Error>}
        <div className={reviewStyle.reviewUserButtonBar}>
          <Button
            type="submit"
            name="save"
            className={reviewStyle.buttonUserSave}>
            Save
          </Button>
        </div>
      </form>
    )
  }
}
