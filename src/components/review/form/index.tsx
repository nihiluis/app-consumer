import * as React from "react"
import { Formik } from "formik"

import {
  ReviewUserValueContainer,
  User,
  ReviewSchema,
} from "polyvolve-ui/lib/@types"

import { ReviewActions, ReviewCriterionValueBody } from "../../../redux/review"
import ReviewUserForm from "./ReviewUserForm"

// TODO this file is a huge mess and the radioBar and description could be aligned. although I don't think it's necessary, hm.

interface Props {
  hash: string
  schema: ReviewSchema
  previousUser?: User
  previousReviewUser?: ReviewUserValueContainer
  user: User
  reviewUser: ReviewUserValueContainer
  nextUser?: User
  nextReviewUser?: ReviewUserValueContainer
  saveError: string
  reviewActions: typeof ReviewActions
  activeUserIdx: number
  users: User[]
  page: number
  maxPage: number
  switchPage: (page: number) => void
  switchUser: (idx: number) => void
}

interface State {
  initialFormValues: ReviewUserFormValues
}

export type ReviewUserFormValues = any

export default class ReviewUserFormWrapper extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)

    const { reviewUser } = this.props

    const initialFormValues = {}

    reviewUser.values.forEach(valueContainer => {
      initialFormValues[valueContainer.criterion.id] =
        valueContainer.value.value
    })

    this.state = {
      initialFormValues,
    }
  }

  onSubmit = (values: ReviewUserFormValues) => {
    const { reviewActions, reviewUser, hash } = this.props

    const criterionValues: ReviewCriterionValueBody[] = []
    for (var criterionId in values) {
      criterionValues.push({
        criterionId: criterionId,
        value: values[criterionId],
      })
    }

    reviewActions.saveReviewCriterionValuesRequest({
      hash,
      reviewUser,
      values: criterionValues,
    })
  }

  validate = () => {}

  componentDidMount() {
    document.body.addEventListener("keyup", this.handleKeyDown)
  }

  componentWillUnmount() {
    document.body.removeEventListener("keyup", this.handleKeyDown)
    // unregister left right listener
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { switchUser, activeUserIdx, users } = this.props

    let newIdx = activeUserIdx

    if (event.ctrlKey && event.key === "ArrowLeft") {
      newIdx -= 1
    } else if (event.ctrlKey && event.key === "ArrowRight") {
      newIdx += 1
    }

    if (newIdx === users.length) {
      newIdx = 0
    } else if (newIdx === -1) {
      newIdx = users.length - 1
    }

    if (newIdx === activeUserIdx) return

    switchUser(newIdx)
  }

  render(): JSX.Element {
    const { initialFormValues } = this.state

    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={this.onSubmit}
        render={formikProps => (
          <ReviewUserForm {...this.props} {...formikProps} />
        )}
      />
    )
  }
}
