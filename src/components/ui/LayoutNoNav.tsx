import * as React from "react"
import { Header, Logo, LogoText, Load } from "polyvolve-ui/lib"
import { Footer } from "."
import Head from "next/head"

import { connect } from "react-redux"
import { RootState } from "../../redux"
import { SITE_NAME } from "../../constants/env"
import { componentStyle } from "../../lib/reexports"

interface Props {
  loading: boolean
}

const Layout: React.FunctionComponent<Props> = props => (
  <div id="layout">
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>{SITE_NAME}</title>
    </Head>
    <Header>
      <div className={componentStyle.logoHeader}>
        {props.loading && <Load size={24} />}
        {!props.loading && <Logo className={componentStyle.logo} size={24} />}
        <LogoText text="Polyvolve" size={24} />
      </div>
    </Header>
    <main>
      <div className={componentStyle.pageContent}>{props.children}</div>
    </main>
    <Footer />
  </div>
)

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    loading: state.dataOverview.loading || state.review.loading,
  }
}

export default connect<{}, {}, Props>(mapStateToProps)(Layout)
