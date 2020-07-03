import { AxiosResponse, AxiosError } from "axios"
import { lazyProtect } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import {
  ReviewMaster,
  ReviewUserValueContainer,
  ReviewCriterionValue,
} from "polyvolve-ui/lib/@types"
import { take, call, put, delay, takeEvery } from "redux-saga/effects"
import { API_URL } from "../../constants/env"
import { axios, defaultHeaders, getErrorMessage } from "../../lib/axios"

export interface ReviewState {
  loading: boolean
  initialized: boolean
  saveInitialized: boolean
  saveError: string
  error: string
  reviewUser?: ReviewUserValueContainer
  loadingUserId: string
}

export interface ReviewCriterionValueBody {
  // strictly the criterion id.
  criterionId: string
  value: any
}

const actionNames = {
  GET_OR_CREATE_REVIEW_USER_REQUEST: "GET_OR_CREATE_REVIEW_USER_REQUEST",
  GET_OR_CREATE_REVIEW_USER_RESPONSE: "GET_OR_CREATE_REVIEW_USER_RESPONSE",
  GET_REVIEW_CRITERION_VALUES_REQUEST: "GET_REVIEW_CRITERION_VALUES_REQUEST",
  GET_REVIEW_CRITERION_VALUES_RESPONSE: "GET_REVIEW_CRITERION_VALUES_RESPONSE",
  SAVE_REVIEW_USER_REQUEST: "SAVE_REVIEW_USER_REQUEST",
  SAVE_REVIEW_USER_RESPONSE: "SAVE_REVIEW_USER_RESPONSE",
  SAVE_REVIEW_CRITERION_VALUES_REQUEST: "SAVE_CRITERION_VALUES_REQUEST",
  SAVE_REVIEW_CRITERION_VALUES_RESPONSE: "SAVE_CRITERION_VALUES_RESPONSE",
}

const actions = {
  getOrCreateReviewUserRequest: createAction<{}>(
    actionNames.GET_OR_CREATE_REVIEW_USER_REQUEST
  ),
  getOrCreateReviewUserResponse: createAction<ReviewMaster>(
    actionNames.GET_OR_CREATE_REVIEW_USER_RESPONSE
  ),
  getReviewCriterionValuesRequest: createAction<{}>(
    actionNames.GET_REVIEW_CRITERION_VALUES_REQUEST
  ),
  getReviewCriterionValuesResponse: createAction<ReviewMaster>(
    actionNames.GET_REVIEW_CRITERION_VALUES_RESPONSE
  ),
  saveReviewUserRequest: createAction<{}>(actionNames.SAVE_REVIEW_USER_REQUEST),
  saveReviewUserResponse: createAction<ReviewMaster>(
    actionNames.SAVE_REVIEW_USER_RESPONSE
  ),
  saveReviewCriterionValuesRequest: createAction(
    actionNames.SAVE_REVIEW_CRITERION_VALUES_REQUEST
  ),
  saveReviewCriterionValuesResponse: createAction(
    actionNames.SAVE_REVIEW_CRITERION_VALUES_RESPONSE
  ),
}

export const ReviewActions = actions

const initialReviewState: ReviewState = {
  loading: false,
  initialized: false,
  saveInitialized: false,
  error: "",
  saveError: "",
  loadingUserId: "",
}

export const reducer = handleActions<ReviewState, any>(
  {
    [actionNames.GET_OR_CREATE_REVIEW_USER_REQUEST]: (state, action) => {
      const { user } = action.payload
      action.payload.loadingUserId = user.name

      return {
        ...state,
        ...action.payload,
        loading: true,
        loadingUserId: user.name,
      }
    },
    [actionNames.GET_OR_CREATE_REVIEW_USER_RESPONSE]: (state, action) => {
      const { loadingUserId } = action.payload

      if (loadingUserId !== state.loadingUserId) {
        return { ...state }
      }

      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.SAVE_REVIEW_USER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.SAVE_REVIEW_USER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.SAVE_REVIEW_USER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.SAVE_REVIEW_USER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.SAVE_REVIEW_CRITERION_VALUES_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        saveInitialized: false,
      }
    },
    [actionNames.SAVE_REVIEW_CRITERION_VALUES_RESPONSE]: (state, action) => {
      return {
        ...state,
        saveError: action.payload.error,
        loading: false,
        saveInitialized: true,
      }
    },
  },
  initialReviewState
)

export function* watchHandleGetOrCreateReviewUser() {
  yield takeEvery(
    actions.getOrCreateReviewUserRequest,
    handleGetOrCreateReviewUser
  )
}

function* handleGetOrCreateReviewUser(action: any) {
  const { hash, user, review, loadingUserId } = action.payload

  const { ok, err } = yield call(
    lazyProtect<AxiosResponse, AxiosError>(
      axios.post(
        `${API_URL}/datahash/review/user/getorcreate`,
        { dataHashId: hash, userId: user.id, reviewId: review.id },
        { withCredentials: true, headers: { ...defaultHeaders } }
      )
    )
  )

  if (err) {
    yield put(
      actions.getOrCreateReviewUserResponse({
        error: getErrorMessage(err),
        loadingUserId,
      })
    )
    return
  }

  if (ok.status != 200) {
    yield put(
      actions.getOrCreateReviewUserResponse({
        error: getErrorMessage(err),
        loadingUserId,
      })
    )
    return
  }

  const reviewUser: ReviewUserValueContainer = ok.data.data
  // check if a review already exists

  yield put(
    actions.getOrCreateReviewUserResponse({
      error: "",
      reviewUser,
      loadingUserId,
    })
  )
}

export function* handleSaveReviewUser() {
  while (true) {
    const action = yield take(actions.saveReviewUserRequest)
    const { hash, reviewUserId } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/datahash/reviewuser/save`,
          { hash, reviewUserId },
          { withCredentials: true, headers: { ...defaultHeaders } }
        )
      )
    )

    if (err) {
      yield put(actions.saveReviewUserResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.saveReviewUserResponse({ error: getErrorMessage(err) }))
      continue
    }

    const reviewUser: ReviewUserValueContainer = ok.data.data
    // check if a review already exists

    yield put(actions.saveReviewUserResponse({ error: "", reviewUser }))
  }
}

export function* handleGetReviewCriterionValues() {
  while (true) {
    const action = yield take(actions.getReviewCriterionValuesRequest)
    const { hash, reviewUser } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/datahash/review/user/value/get/all`,
          { dataHashId: hash, reviewUserId: reviewUser.id },
          { withCredentials: true, headers: { ...defaultHeaders } }
        )
      )
    )

    if (err) {
      yield put(
        actions.getReviewCriterionValuesResponse({
          error: getErrorMessage(err),
        })
      )
      continue
    }

    if (ok.status != 200) {
      yield put(
        actions.getReviewCriterionValuesResponse({
          error: getErrorMessage(err),
        })
      )
      continue
    }

    const reviewCriterionValues: ReviewCriterionValue[] = ok.data.data
    // check if a review already exists

    //TODO
    console.error("Not implemented.")

    yield put(
      actions.getReviewCriterionValuesResponse({
        error: "",
        reviewUser,
      })
    )
  }
}

export function* handleSaveReviewCriterionValues() {
  while (true) {
    const action = yield take(actions.saveReviewCriterionValuesRequest)
    const hash: string = action.payload.hash
    const reviewUser: ReviewUserValueContainer = action.payload.reviewUser
    const values: ReviewCriterionValueBody[] = action.payload.values

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/datahash/review/user/value/save/all`,
          { dataHashId: hash, reviewUserId: reviewUser.id, values },
          { withCredentials: true, headers: { ...defaultHeaders } }
        )
      )
    )

    if (err) {
      yield put(
        actions.saveReviewCriterionValuesResponse({
          error: getErrorMessage(err),
        })
      )
      continue
    }

    if (ok.status != 200) {
      yield put(
        actions.saveReviewCriterionValuesResponse({
          error: getErrorMessage(err),
        })
      )
      continue
    }

    // check if a review already exists
    yield put(actions.saveReviewCriterionValuesResponse({ error: "" }))
  }
}
