import * as React from "react"
import {Footer } from "."
import Head from "next/head"
import { style } from "../../lib/reexports"


const Layout: React.FunctionComponent = props =>
  <div id="layout">
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
    </Head>
    <main className={style.page}>
      <div className={style.pageContentWhite}>
        {props.children}
      </div>
    </main>
    <Footer />
  </div>

export default Layout
