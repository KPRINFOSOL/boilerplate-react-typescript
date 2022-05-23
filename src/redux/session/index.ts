import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ACTION_TYPES } from '../../constants'
import * as localStorage from '../../services/localstorage'
export interface ISessionState {
  authToken: string | undefined
  loading: boolean
  isAuthenticated: boolean
  userId: string
  user: any
}

function getDefaultState(): ISessionState {
  //FETCH ALL SESSION PROPERTIES FROM LOCAL STORAGE TO AFFECT STORE
  return {
    authToken: localStorage.getLocalStorageItem('authToken') || undefined,
    isAuthenticated: localStorage.getLocalStorageItem('isAuthenticated') === 'true' || false,
    userId: localStorage.getLocalStorageItem('userId') || '',
    loading: false,
    user: {},
  }
}

export const sessionSlice = createSlice({
  name: 'counter',
  initialState: getDefaultState(),
  reducers: {
    [ACTION_TYPES.AUTH_LOGIN_PENDING]: (state, action: PayloadAction<ISessionState>) => {
      state.loading = action.payload.loading
    },
  },
})

// Action creators are generated for each case reducer function
export const { AUTH_LOGIN_PENDING } = sessionSlice.actions

export default sessionSlice.reducer
