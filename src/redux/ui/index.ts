import { createAction, handleActions } from "redux-actions"

export interface UIState {
  showExtendedUi: boolean
}

const initialUiState: UIState = {
  showExtendedUi: false
}

export const actionNames = {
  TOGGLE_UI: "TOGGLE_UI"
}

export const actions = {
  toggleUi: createAction<Partial<UIState>>(actionNames.TOGGLE_UI)
}

export const reducer = handleActions<UIState, Partial<UIState>>({
  [actionNames.TOGGLE_UI]: (state, action) => {
    return {
      showExtendedUi: !state.showExtendedUi
    }
  }
}, initialUiState)
