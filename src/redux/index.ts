import { combineReducers } from "redux"
import { fork } from "redux-saga/effects"
import { reducer as persist, PersistState } from "./persist"
import { reducer as ui, UIState } from "./ui"
import {
  reducer as dataOverview,
  DataGlobalState,
  handleGetReviewData,
  handleGetOrCreateReview,
} from "./overview"
import {
  reducer as review,
  ReviewState,
  handleSaveReviewUser,
  watchHandleGetOrCreateReviewUser,
  handleSaveReviewCriterionValues,
  handleGetReviewCriterionValues,
} from "./review"

export const reducer = combineReducers<RootState>({
  persist,
  ui,
  dataOverview: dataOverview,
  review,
})

export interface RootState {
  persist: PersistState
  ui: UIState
  dataOverview: DataGlobalState
  review: ReviewState
}

export default function* rootSaga() {
  yield fork(handleGetReviewData)
  yield fork(handleGetOrCreateReview)
  yield fork(watchHandleGetOrCreateReviewUser)
  yield fork(handleSaveReviewUser)
  yield fork(handleSaveReviewCriterionValues)
  yield fork(handleGetReviewCriterionValues)
}
