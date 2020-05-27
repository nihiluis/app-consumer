import * as React from "react"
import cx from "classnames"
import Link from "next/link"
import { Avatar } from "polyvolve-ui/lib"
import { ReviewUserValueContainer } from "polyvolve-ui/lib/@types"

import * as style from "./style.scss"
import * as globalStyle from "../../style/style.scss"
import * as avatarStyle from "../../style/avatar.scss"

interface Props {
  reviewUsers: ReviewUserValueContainer[]
  hash: string
}

const UsersForReviewList: React.FunctionComponent<Props> = props => {
  const { reviewUsers, hash } = props

  return (
    <React.Fragment>
      <h3 className={style.usersTitle}>Persons to review</h3>
      <div>
        {reviewUsers.map(reviewUser => <UserItem
          key={"item-" + reviewUser.reviewedUser.id}
          reviewUser={reviewUser}
          hash={hash} />)}
      </div>
    </React.Fragment>
  )
}

interface ItemProps {
  reviewUser: ReviewUserValueContainer
  hash: string
}

const UserItem: React.FunctionComponent<ItemProps> = props => {
  const { reviewUser, hash } = props
  const { reviewedUser } = reviewUser

  const classes = cx(style.userListItem, { [style.completed]: reviewUser.markedCompleted })
  const gradientStyle = "" // `rgba(${user.color.r},${user.color.g}, ${user.color.b}, 0.15)`

  return (
    <div className={classes} style={{ background: gradientStyle }}>
      <Avatar url={reviewedUser.avatar} size={24} className={style.miniAvatar} name={reviewedUser.surname} />
      <Link href={{ pathname: '/review', query: { id: hash } }}>
        <a>
          {reviewedUser.name + " " + reviewedUser.surname}
        </a>
      </Link>
      <p>{reviewedUser.position}</p>
      <div className={style.userDueAtList}>
        {!reviewUser.markedCompleted && <p className={globalStyle.short}>Not completed</p>}
        {reviewUser.markedCompleted && <p className={globalStyle.long}>Completed</p>}
      </div>
    </div>
  )
}

export default UsersForReviewList
