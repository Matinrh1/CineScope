import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  popular: [],
  loading: false,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setPopularMovies(state, action) {
      state.popular = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setPopularMovies, setLoading } = movieSlice.actions;
export default movieSlice.reducer;
