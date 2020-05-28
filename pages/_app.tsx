import "isomorphic-fetch"
import * as React from "react"
import { Provider } from "react-redux"
import App, { Container } from "next/app"
import Head from "next/head"
import { getStore } from "../src/store"
import { SITE_NAME } from "../src/constants/env"
import * as style from "../src/style/style.scss"

export default class extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const server = !!ctx.req
    const store = getStore(undefined, server)
    const state = store.getState()
    const out = { state, server } as any

    if (Component.getInitialProps) {
      return {
        ...out,
        pageProps: {
          ...(await Component.getInitialProps(ctx)),
        },
      }
    }

    return out
  }

  render() {
    const { props } = this as any
    const { Component, pageProps } = props

    return (
        <Provider store={getStore(undefined, props.server)}>
          <Component {...pageProps} />
        </Provider>
    )
  }
}

export { style }
