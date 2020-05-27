import * as React from "react"
import { connect } from "react-redux"
import { Dispatch, bindActionCreators } from "redux"
import Router from "next/router"
import Link from "next/link"
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
import {
  NextIcon,
  BackIcon,
  HomeIcon,
} from "polyvolve-ui/lib/icons"
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
import { globalStyle, cx } from "../../lib/reexports"
import * as style from "./style.scss"

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

class ReviewContent extends React.Component<Props> {
  getUserIdx = (props: Props = this.props): number => {
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

    return props.reviewedUsers[this.getUserIdx()]
  }

  updateUser = (userIdx: number, pushRoute: boolean = true) => {
    const { hash, reviewedUsers } = this.props

    if (userIdx >= this.props.reviewedUsers.length) {
      return
    }

    if (pushRoute) {
      Router.push(`/review?id=${hash}&userId=${reviewedUsers[userIdx].id}`)
    }
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
          console.log("mount")
          reviewActions.getOrCreateReviewUserRequest({ hash, review, user })
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.review) {
      const user = this.getActiveUser(this.props)

      if (prevProps.userId !== this.props.userId) {
        console.log("has new user")
        this.props.reviewActions.getOrCreateReviewUserRequest({
          hash: this.props.hash,
          review: this.props.review,
          user,
        })
        return
      }

      const hasNewReview =
        (!prevProps.review && this.props.review) ||
        prevProps.review !== this.props.review

      if (hasNewReview) {
        console.log("has new review")
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

    const activeUserIdx = this.getUserIdx()
    const hasUser = reviewedUsers.length > 0 && reviewUser
    const user = hasUser ? reviewedUsers[activeUserIdx] : null
    const hasNextUser = activeUserIdx < reviewedUsers.length
    const hasPreviousUser = activeUserIdx >= 1

    const nextUser = hasNextUser ? reviewedUsers[activeUserIdx + 1] : null
    const previousUser = hasPreviousUser
      ? reviewedUsers[activeUserIdx - 1]
      : null

    return (
      <React.Fragment>
        <div className={globalStyle.content}>
          <Row className={style.row}>
            {!reviewUser && !loading && initialized && (
              <Error>Unable to find users which can be reviewed.</Error>
            )}
            <div className={style.reviewIconNavigationBar}>
              <Link href={`/?id=${hash}`}>
                <HomeIcon
                  size={{ width: 16, height: 16 }}
                  title="Go back to the start page"
                />
              </Link>
            </div>
            <div className={style.reviewUserNavigationHeader}>
              <p>
                <strong>Reviewing</strong>
              </p>
            </div>
            <div className={style.userNav}>
              <div className={style.next}>
                {previousUser && (
                  <div className={style.reviewUserNavigation}>
                    <BackIcon
                      size={{ width: 16, height: 16 }}
                      onClick={() => this.updateUser(activeUserIdx - 1)}
                    />
                    <Avatar
                      url={previousUser.avatar}
                      size={24}
                      className={style.miniAvatar}
                      name={previousUser.surname}
                    />
                    <a>{previousUser.name + " " + previousUser.surname}</a>
                  </div>
                )}
              </div>
              <div>
                <div className={style.reviewNavigation}>
                  <div className={style.reviewUserNavigationInfo}>
                    {!user && <Error>Unable to find User!</Error>}
                    {user && (
                      <React.Fragment>
                        <Avatar
                          url={user.avatar}
                          size={24}
                          className={style.miniAvatar}
                          name={user.surname}
                        />
                        <p>{user.name + " " + user.surname}</p>
                        <p>{user.position}</p>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
              <div className={style.next}>
                {nextUser && (
                  <div className={cx(style.reviewUserNavigation, style.last)}>
                    <Avatar
                      url={nextUser.avatar}
                      size={24}
                      className={style.miniAvatar}
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
              <div className={globalStyle.reviewContainer}>
                <div className={globalStyle.reviewInner}>
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
