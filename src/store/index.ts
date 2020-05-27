import { applyMiddleware, compose, createStore, Store, Middleware } from "redux"
import rootSaga, { reducer, RootState } from "../redux"
import { DEV } from "../constants/env"
import { createLogger } from "redux-logger"
import { persistStore, autoRehydrate } from "redux-persist"
import createSagaMiddleware from "@redux-saga/core"
//import { loadingBarMiddleware } from "react-redux-loading-bar"

let store

export const getStore = (state, isServer?): Store<RootState> => {
  const sagaMiddleware = createSagaMiddleware()

  if (isServer && typeof window === "undefined") {
    return createStore<RootState, any, {}, undefined>(
      reducer,
      state,
      applyMiddleware(sagaMiddleware)
    )
  } else {
    const composeEnhancers =
      (DEV && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

    if (!store) {
      const mw: Middleware[] = [sagaMiddleware]
      if (!DEV) {
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}
        }
      } else {
        console.log("Development mode activated for store.")
        mw.push(
          createLogger({
            //predicate: (getState, action) => !/^@@/.test(action.type),
            //collapsed: true
          })
        )
      }

      //mw.push(loadingBarMiddleware({ promiseTypeSuffixes: ["REQUEST", "RESPONSE"] }))

      store = createStore<RootState, any, {}, undefined>(
        reducer,
        state,
        composeEnhancers(applyMiddleware(...mw), autoRehydrate())
      )

      const whitelist = ["persist"]
      persistStore(store, { whitelist }, _ => {
        console.log(`define whitelist: ${whitelist.join(", ")}`)
      })

      sagaMiddleware.run(rootSaga)
    }
    return store
  }
}
