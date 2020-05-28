import * as React from "react"
import { connect } from "react-redux"
import moment from "moment"
import Link from "next/link"

import { RootState } from "../../redux"
import { Notification, Row, Load, Error, Button } from "polyvolve-ui/lib"
import UserList from "../userdata/UserList"

import { style, homeStyle } from "../../lib/reexports"
import {
  ReviewMaster,
  User,
  Review,
  ReviewUserValueContainer,
} from "polyvolve-ui/lib/@types"
import { DataGlobalActions } from "../../redux/overview"
import { Dispatch, bindActionCreators } from "redux"

interface Props {
  actions?: typeof DataGlobalActions
  dataHashId?: string
  master?: ReviewMaster
  review?: Review
  reviewingUser?: User
  loading: boolean
  initialized: boolean
  error?: string
}

interface State {
  reviewUsers: ReviewUserValueContainer[]
}

class HomeContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      reviewUsers: [],
    }
  }

  componentDidMount() {
    document.body.classList.add(homeStyle.blank)

    const { dataHashId, actions } = this.props

    if (dataHashId) {
      actions.getReviewDataRequest({ hash: dataHashId })
      actions.getOrCreateReviewRequest({ hash: dataHashId })
    }
  }

  componentWillUnmount() {
    document.body.classList.remove(homeStyle.blank)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.master !== this.props.master ||
        prevProps.review !== this.props.review) &&
      this.props.master &&
      this.props.review
    ) {
      const reviewUsers = this.getReviewUsers()
      this.setState({ reviewUsers })
    }
  }

  /**
   * A [ReviewUserValueContainer] only exists, if the [reviewingUser] has already opened the review page for
   * the respective [reviewedUser]. In the [HomeContent] component we want to display all [reviewedUser]s
   * however and also want to know whether the [reviewingUser] has already finished the review for the
   * specific [reviewedUser]s. Therefore, we take the already existing [ReviewUserValueContainer]s as a base
   * and add dummies for those [reviewedUser]s which have not been yet look at by the [reviewingUser].
   */
  getReviewUsers(): ReviewUserValueContainer[] {
    const { master, review } = this.props
    const reviewUsers = review.reviewUsers || []
    const reviewUsersMap = new Map(
      reviewUsers.map(reviewUser => [reviewUser.reviewedUser.id, reviewUser])
    )
    const allUsers = master.reviewedUsers

    if (allUsers.length !== reviewUsersMap.size) {
      for (let user of allUsers) {
        if (!reviewUsersMap.has(user.id)) {
          const reviewUser: ReviewUserValueContainer = {
            id: "",
            markedCompleted: false,
            review,
            reviewedUser: user,
            values: [],
          }

          reviewUsersMap.set(user.id, reviewUser)
        }
      }
    }

    return Array.from(reviewUsersMap, ([_, value]) => value).sort(
      (reviewUser1, reviewUser2) => {
        if (reviewUser1.reviewedUser.surname > reviewUser2.reviewedUser.surname)
          return 1
        if (reviewUser1.reviewedUser.surname < reviewUser2.reviewedUser.surname)
          return -1
        return 0
      }
    )
  }

  render(): JSX.Element {
    const { dataHashId, loading, master, reviewingUser, error } = this.props

    const reviewUsers = this.state.reviewUsers

    const periodStartFormatted = master
      ? moment(master!.periodStart).format("Do MMM YY")
      : null
    const periodEndFormatted = master
      ? moment(master!.periodEnd).format("Do MMM YY")
      : null
    const dueAtFormatted = master
      ? moment(master!.dueAt).format("Do MMM YY")
      : null

    return (
      <React.Fragment>
        <Row className={homeStyle.row}>
          <Notification
            type="warning"
            table={true}
            className={homeStyle.notification}>
            This is a prototype of Polyvolve. Functionality not guaranteed.
          </Notification>
          {!dataHashId && (
            <Error className={style.alignCenter}>Invalid link.</Error>
          )}
          {loading && <Load />}
          {error && <Error className={style.alignCenter}>{error}</Error>}
          {!loading && !reviewingUser && (
            <Error className={style.alignCenter}>
              Unable to retrieve user for this link. Sorry!
            </Error>
          )}
          {!loading && reviewingUser && (
            <div className={homeStyle.greeting}>
              <p className={homeStyle.hiText}>
                Hi{" "}
                <strong>
                  {reviewingUser.name} {reviewingUser.surname}
                </strong>
                , thank you for participating in the {master.name}!
              </p>
              <p>
                <strong>Review Description: </strong>
                {master.description || "None"}
              </p>
            </div>
          )}
          {!loading && !master && (
            <Error className={style.alignCenter}>
              Unable to retrieve the data for this link. You can't perform your
              Review for now. Please report it to the responsible person. Sorry!
            </Error>
          )}
          {!loading && master && (
            <div>
              <p className={homeStyle.reviewTitle}>
                The Review concerns the time range from{" "}
                <strong>{periodStartFormatted}</strong> to{" "}
                <strong>{periodEndFormatted}</strong> and is due at{" "}
                <strong>{dueAtFormatted}</strong>
              </p>
              {reviewUsers[0] && (
                <Link
                  href={{
                    pathname: "/review",
                    query: { id: dataHashId, userId: reviewUsers[0].id },
                  }}>
                  <a>
                    <Button className={homeStyle.reviewButton} name="Review">
                      Start!
                    </Button>
                  </a>
                </Link>
              )}
              <UserList reviewUsers={reviewUsers} hash={dataHashId} />
            </div>
          )}
        </Row>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    loading: state.dataOverview.loading,
    master: state.dataOverview.master,
    reviewingUser: state.dataOverview.user,
    review: state.dataOverview.review,
    initialized: state.dataOverview.initialized,
    error: state.dataOverview.error,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    actions: bindActionCreators(DataGlobalActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps as any
)(HomeContent)
