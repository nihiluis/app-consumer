import { AxiosResponse, AxiosError } from "axios"
import { lazyProtect } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import {
  ReviewMaster,
  ReviewSchema,
  Review,
  User,
} from "polyvolve-ui/lib/@types"
import { sortByOrder, sortBySurname } from "polyvolve-ui/lib/utils/sort"
import { take, call, put } from "redux-saga/effects"
import { API_URL } from "../../constants/env"
import {
  axios,
  defaultHeaders,
  getErrorMessage,
} from "../../lib/axios"

export interface DataGlobalState {
  master?: ReviewMaster
  schema?: ReviewSchema
  review?: Review
  user?: User
  loading: boolean
  error: string
  initialized: boolean
}

const actionNames = {
  GET_REVIEW_DATA_REQUEST: "GET_REVIEW_DATA_REQUEST",
  GET_REVIEW_DATA_RESPONSE: "GET_REVIEW_DATA_RESPONSE",
  CREATE_REVIEW_REQUEST: "CREATE_REVIEW_REQUEST",
  CREATE_REVIEW_RESPONSE: "CREATE_REVIEW_RESPONSE",
}

const actions = {
  getReviewDataRequest: createAction<{}>(actionNames.GET_REVIEW_DATA_REQUEST),
  getReviewDataResponse: createAction<ReviewMaster>(
    actionNames.GET_REVIEW_DATA_RESPONSE
  ),
  getOrCreateReviewRequest: createAction<{}>(actionNames.CREATE_REVIEW_REQUEST),
  getOrCreateReviewResponse: createAction<Review>(
    actionNames.CREATE_REVIEW_RESPONSE
  ),
}

export const DataGlobalActions = actions

const initialReviewState: DataGlobalState = {
  loading: false,
  initialized: false,
  error: "",
}

export const reducer = handleActions<DataGlobalState, Partial<DataGlobalState>>(
  {
    [actionNames.GET_REVIEW_DATA_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
        initialized: false,
      }
    },
    [actionNames.GET_REVIEW_DATA_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        initialized: true,
      }
    },
    [actionNames.CREATE_REVIEW_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.CREATE_REVIEW_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
  },
  initialReviewState
)

export function* handleGetReviewData() {
  while (true) {
    const action = yield take(actions.getReviewDataRequest)
    const { hash } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/datahash/get/${hash}`, {
          withCredentials: true,
          headers: { ...defaultHeaders },
        })
      )
    )

    if (err) {
      yield put(actions.getReviewDataResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.getReviewDataResponse({ error: getErrorMessage(err) }))
      continue
    }

    const master: ReviewMaster = ok.data.data.master
    master.reviewedUsers = ok.data.data.reviewedUsers.sort(sortBySurname)
    const user: User = ok.data.data.user
    const schema: ReviewSchema = master.schema
    schema.categories.sort(sortByOrder)
    schema.categories.forEach(category => {
      category.criteria.sort(sortByOrder)
    })
    // check if a review already exists

    yield put(
      actions.getReviewDataResponse({ error: "", master, user, schema })
    )
  }
}

export function* handleGetOrCreateReview() {
  while (true) {
    const action = yield take(actions.getOrCreateReviewRequest)
    const { hash } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/datahash/review/getorcreate/${hash}`, {
          withCredentials: true,
          headers: { ...defaultHeaders },
        })
      )
    )

    if (err) {
      yield put(
        actions.getOrCreateReviewResponse({ error: getErrorMessage(err) })
      )
      continue
    }

    if (ok.status != 200) {
      yield put(
        actions.getOrCreateReviewResponse({ error: getErrorMessage(err) })
      )
      continue
    }

    const review: Review = ok.data.data

    yield put(actions.getOrCreateReviewResponse({ error: "", review }))
  }
}
