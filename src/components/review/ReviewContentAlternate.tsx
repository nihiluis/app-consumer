import * as React from "react"
import { connect } from "react-redux"
import { Dispatch, bindActionCreators } from "redux"
import Router from "next/router"
import {
  Row,
  Notification,
  Error,
  Load,
  Wizard,
  Avatar,
  Logo,
  LogoText,
} from "polyvolve-ui/lib"
import { NextIcon, BackIcon } from "polyvolve-ui/lib/icons"
import {
  ReviewUserValueContainer,
  ReviewMaster,
  User,
  ReviewSchema,
  Review,
} from "polyvolve-ui/lib/@types"

import ReviewNavigation from "./navigation"
import { RootState } from "../../redux"
import { ReviewActions } from "../../redux/review"
import { DataGlobalActions } from "../../redux/overview"
import ReviewUserFormWrapper from "./form"
import { style, reviewStyle } from "../../lib/reexports"

interface Props {
  loading: boolean
  initialized: boolean
  saveInitialized?: boolean
  saveError?: string
  hash?: string
  userId?: string
  activeUserIdx: number
  reviewMaster?: ReviewMaster
  review?: Review
  schema?: ReviewSchema
  reviewedUsers: User[]
  reviewUser?: ReviewUserValueContainer
  dataGlobalActions?: typeof DataGlobalActions
  reviewActions?: typeof ReviewActions
}

interface State {
  activeUserIdx: number
}

class ReviewContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeUserIdx: this.calcActiveUserIdx(),
    }
  }

  calcActiveUserIdx = (props: Props = this.props): number => {
    let activeUserIdx = props.activeUserIdx || 0
    if (props.userId && props.reviewedUsers.length > 0) {
      const possibleIdx = props.reviewedUsers.findIndex(
        user => user.id === props.userId
      )
      if (possibleIdx !== -1) {
        activeUserIdx = possibleIdx
      }
    }

    return activeUserIdx
  }

  getActiveUser = (props: Props = this.props): User | null => {
    if (props.reviewedUsers.length === 0) {
      return null
    }

    return props.reviewedUsers[this.state.activeUserIdx]
  }

  updateUser = (userIdx: number, pushRoute: boolean = true) => {
    const { hash, review, reviewActions, reviewedUsers } = this.props

    if (userIdx >= this.props.reviewedUsers.length) {
      return
    }

    if (userIdx === this.state.activeUserIdx) {
      return
    }

    if (pushRoute) {
      Router.push(`/review?id=${hash}&userId=${reviewedUsers[userIdx].id}`)
    }

    this.setState({ activeUserIdx: userIdx }, () =>
      reviewActions.getOrCreateReviewUserRequest({
        hash,
        review,
        user: reviewedUsers[userIdx],
      })
    )
  }

  componentDidMount() {
    const {
      hash,
      reviewMaster,
      review,
      dataGlobalActions,
      reviewActions,
    } = this.props

    if (hash) {
      if (!reviewMaster) {
        dataGlobalActions.getReviewDataRequest({ hash })
      }

      if (!review) {
        dataGlobalActions.getOrCreateReviewRequest({ hash })
      }

      if (review) {
        const user = this.getActiveUser()
        if (user) {
          reviewActions.getOrCreateReviewUserRequest({ hash, review, user })
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.review) {
      const user = this.getActiveUser(this.props)

      if (this.props.userId !== prevProps.userId) {
        this.updateUser(this.calcActiveUserIdx(), false)
      } else if (user && this.props.userId !== user.id) {
        this.updateUser(this.calcActiveUserIdx(), false)
      } else {
        const hasNewReview =
          (!prevProps.review && this.props.review) ||
          prevProps.review !== this.props.review

        if (hasNewReview) {
          if (user) {
            this.props.reviewActions.getOrCreateReviewUserRequest({
              hash: this.props.hash,
              review: this.props.review,
              user,
            })
          }
        }
      }
    }
  }

  render(): JSX.Element {
    const {
      reviewedUsers,
      reviewUser,
      schema,
      loading,
      initialized,
      hash,
      saveError,
      reviewActions,
    } = this.props
    const { activeUserIdx } = this.state

    const user = reviewUser ? reviewUser.reviewedUser : undefined
    const hasNextUser = activeUserIdx < reviewedUsers.length
    const hasPreviousUser = activeUserIdx >= 1

    const nextUser = hasNextUser ? reviewedUsers[activeUserIdx + 1] : null
    const previousUser = hasPreviousUser
      ? reviewedUsers[activeUserIdx - 1]
      : null

    return (
      <React.Fragment>
        <ReviewNavigation
          user={user}
          users={reviewedUsers}
          reviewUser={reviewUser}
          idx={activeUserIdx}
          updateUser={this.updateUser}
          hash={hash}
          showErrors={!loading && initialized}
        />
        <div className={style.content}>
          <Row className={reviewStyle.row}>
            {loading && <Load />}
            {!reviewUser && !loading && initialized && (
              <Error>Unable to find users which can be reviewed.</Error>
            )}
            <div className={reviewStyle.userNav}>
              <div className={reviewStyle.next}>
                {previousUser && (
                  <div className={reviewStyle.reviewNavigationUserInfo}>
                    <BackIcon
                      size={{ width: 16, height: 16 }}
                      onClick={() => this.updateUser(activeUserIdx - 1)}
                    />
                    <Avatar
                      url={previousUser.avatar}
                      size={24}
                      className={reviewStyle.miniAvatar}
                      name={previousUser.surname}
                    />
                    <a>{previousUser.name + " " + previousUser.surname}</a>
                  </div>
                )}
              </div>
              <div className={reviewStyle.next}>
                {nextUser && (
                  <div className={reviewStyle.reviewNavigationUserInfo}>
                    <Avatar
                      url={nextUser.avatar}
                      size={24}
                      className={reviewStyle.miniAvatar}
                      name={nextUser.surname}
                    />
                    <a>{nextUser.name + " " + nextUser.surname}</a>
                    <NextIcon
                      size={{ width: 16, height: 16 }}
                      onClick={() => this.updateUser(activeUserIdx + 1)}
                    />
                  </div>
                )}
              </div>
            </div>
            {reviewUser && user && (
              <div className={style.reviewContainer}>
                <div className={style.reviewInner}>
                  <Wizard
                    maxPage={schema.categories.length}
                    render={({ page, maxPage }, switchPage) => (
                      <ReviewUserFormWrapper
                        hash={hash}
                        user={user}
                        reviewUser={reviewUser}
                        schema={schema}
                        saveError={saveError}
                        reviewActions={reviewActions}
                        users={reviewedUsers}
                        activeUserIdx={activeUserIdx}
                        switchUser={this.updateUser}
                        page={page}
                        maxPage={maxPage}
                        switchPage={switchPage}
                      />
                    )}
                  />
                </div>
                <Notification type="hint">
                  You can use the arrow keys to navigate the wizard.
                </Notification>
              </div>
            )}
          </Row>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    reviewMaster: state.dataOverview.master,
    reviewedUsers: state.dataOverview.master
      ? state.dataOverview.master.reviewedUsers
      : [],
    schema: state.dataOverview.schema,
    review: state.dataOverview.review,
    reviewUser: state.review.reviewUser,
    loading: state.dataOverview.loading || state.review.loading,
    initialized: state.dataOverview.initialized && state.review.initialized,
    saveInitialized: state.review.saveInitialized,
    saveError: state.review.saveError,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    dataGlobalActions: bindActionCreators(DataGlobalActions, dispatch),
    reviewActions: bindActionCreators(ReviewActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContent)
