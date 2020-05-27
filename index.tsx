import * as React from "react"
import { withRouter, useRouter } from "next/router"

import { HomeContent, LayoutNoNav } from "./src/components"

const Index = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <LayoutNoNav loading>
      <HomeContent
        dataHashId={id as string}
        loading={false}
        initialized={false}
      />
    </LayoutNoNav>
  )
}

export default Index
