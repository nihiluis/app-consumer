import * as React from "react"
import { Header } from "polyvolve-ui/lib"
import { Navigation, Footer } from "."
import Head from "next/head"
import { style } from "../../../pages/_app"

const Layout: React.FunctionComponent = props =>
  <div id="layout">
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
    </Head>
    <Header>
      <Navigation />
    </Header>
    <main className={style.page}>
      <div className={style.pageContent}>
        {props.children}
      </div>
    </main>
    <Footer enableHide={true} ownerName="Polyvolve" />
  </div>

export default Layout
