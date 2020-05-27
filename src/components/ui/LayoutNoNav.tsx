import * as React from "react"
import { Header, Logo, LogoText, Load } from "polyvolve-ui/lib"
import { Navigation, Footer } from "."
import Head from "next/head"
import cx from "classnames"

import * as style from "../../style/style.scss"
import { globalStyle } from "../../lib/reexports"
import { connect } from "react-redux"
import { RootState } from "../../redux"

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
    </Head>
    <Header>
      <div className={globalStyle.logoHeader}>
        {props.loading && <Load size={24} />}
        {!props.loading && <Logo className={globalStyle.logo} size={24} />}
        <LogoText text="Polyvolve" size={24} />
      </div>
    </Header>
    <main>
      <div className={style.pageContent}>{props.children}</div>
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
