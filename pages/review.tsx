import * as React from "react"
import { useRouter } from "next/router"
import { LayoutNoNav } from "../src/components/ui"
import { ReviewContent } from "../src/components"

const ReviewPage = () => {
  const router = useRouter()
  const { id, userId } = router.query

  return (
    <LayoutNoNav loading={true}>
      <ReviewContent
        hash={id as string}
        userId={userId as string}
        loading={false}
        initialized={false}
        reviewedUsers={[]}
        activeUserIdx={0}
      />
    </LayoutNoNav>
  )
}

export default ReviewPage
