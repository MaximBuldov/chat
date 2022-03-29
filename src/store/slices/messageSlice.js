import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
	data: null,
	status: null,
	error: null
}

const setError = (state, action) => {
	state.status = 'rejected'
	state.error = action.payload
}
///rejectWithValue, dispatch, getState
export const fetchUser = createAsyncThunk(
	'user/fetchUser',
	async ({method, auth, values},{rejectWithValue}) => {
		try {
			const res = values.email
				? await method(auth, values.email, values.password)
				: await method(auth, values)
			return {
				id: res.user.uid,
				email: res.user.email,
				token: res.user.accessToken,
				name: res.user.displayName,
				image: res.user.photoURL
			}
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const signOutUser = createAsyncThunk(
	'user/signOutUser',
	async ({method, auth}, {rejectedWithValue, dispatch}) => {
		try {
			await method(auth)
			dispatch(removeUser())
		} catch (e) {
			return rejectedWithValue(e.message)
		}
	}
)

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		removeUser(state) {
			state.data = null
			state.status = null
			state.error = null
		}
	},
	extraReducers: {
		[fetchUser.pending]: (state) => {
			state.status = 'loading'
			state.error = null
		},
		[fetchUser.fulfilled]: (state, action) => {
			state.status = 'resolved'
			state.error = null
			state.data = action.payload
		},
		[fetchUser.rejected]: setError,
		[signOutUser.rejected]: setError
	}
})

export const {setUser, removeUser} = userSlice.actions

export default userSlice.reducer