/** Vuex Store */
import type {
  ActionContext,
  ActionTree,
  GetterTree,
  MutationTree,
  StoreOptions,
// @ts-ignore
} from 'vuex';

import type { Movie, MovieDetail } from '@/interfaces/MovieInterface';

import { createStore } from '@logue/vue2-helpers/vuex';
import { VuexPersistence } from 'vuex-persist';

import ConfigModule from './ConfigModule';
import type { WritableComputedRef } from 'vue';

/** Root State Interface */
export interface RootState {
  /* + Loading overlay */
  loading: boolean;
  /** ProgressBar Percentage */
  progress: number | null;
  /** SnackBar Text */
  message: string;
  /** Error Message */
  error: string;
  /** Search */
  search: string;
  /** Movies listing */
  movies: Movie[];
  /** Selected Item */
  selectedItem: Movie | null;
  /** Movie detail */
  movieDetail: MovieDetail | null;
  /** Favorite Movies */
  favorites: MovieDetail[];
}

/** State Default value */
const state: RootState = {
  loading: false,
  progress: 0,
  message: '',
  error: '',
  search: '',
  movies: [],
  selectedItem: null,
  movieDetail: null,
  favorites: [],
};

/** Getters */
const getters: GetterTree<RootState, RootState> = {
  loading: (state: RootState): boolean => state.loading,
  progress: (state: RootState): number | null => state.progress,
  message: (state: RootState): string => state.message,
  error: (state: RootState): string => state.error,
  movies: (state: RootState): Movie[] => state.movies,
  selectedItem: (state: RootState): Movie | null => state.selectedItem,
  movieDetail: (state: RootState): Movie | null => state.movieDetail,
  favorites: (state: RootState): MovieDetail[] => state.favorites,
};

/** Mutations */
const mutations: MutationTree<RootState> = {
  /**
   * Store loading
   *
   * @param s - Vuex state
   * @param display - Payload
   */
  storeLoading(state: RootState, display: boolean) {
    state ? state.loading = display : null; 
    if (!display) {
      state.progress = 0;
    }
  },
  /**
   * Store progress
   *
   * @param s - Vuex state
   * @param progress - Payload
   */
  storeProgress(state: RootState, progress: number | null) {
    state.progress = progress;
    state.loading = true;
  },
  /**
   * Store snackbar text
   *
   * @param s - Vuex state
   * @param message - Payload
   */
  storeMessage(state: RootState, message: string) {
    state.message = message;
  },
  /**
   * Store error message
   *
   * @param s - Vuex state
   * @param error - Payload
   */
  storeError(state: RootState, error: string) {
    state.error = error;
  },
  /**
   * Set search string
   *
   * @param s - Vuex state
   * @param search - Payload
   */
  setSearch(state: RootState, search: string) {
    state.search = search;
  },
  /**
   * Set movies list
   *
   * @param state - Vuex state
   * @param movies - Payload
   */
  setMovies(state: RootState, movies: Movie[]) {
    state.movies = movies;
  },
  /**
   * Set selected item mutation.
   *
   * @param state - Vuex State
   * @param item - Selected item
   */
  setSelectedItem(state: RootState, item: Movie | null) {
    state.selectedItem = item;
  },
  /**
   * Set movie detail mutation.
   *
   * @param state - Vuex State
   * @param item - Selected item
   */
  storeMovieDetail(state: RootState, item: MovieDetail | null) {
    state.movieDetail = item;
  },
  /**
   * Store favorites
   *
   * @param state - Vuex state
   * @param favorites - Payload
  */
  storeFavorites(state: RootState, favorites: MovieDetail[]) {
    state.favorites = favorites;
  },
};

/** Actions */
const actions: ActionTree<RootState, RootState> = {
  /**
   * Loading overlay visibility
   *
   * @param context - Vuex Context
   * @param display - Visibility
   */
  setLoading(
    context: ActionContext<RootState, RootState>,
    display: boolean = false
  ) {
    context.commit('storeLoading', display);
  },
  /**
   * Loading progress bar value
   *
   * @param context - Vuex Context
   * @param progress - Percentage(0~100), null is intermediate
   */
  setProgress(
    context: ActionContext<RootState, RootState>,
    progress: number | null = 0
  ) {
    context.commit('storeProgress', progress);
  },
  /**
   * Set snackbar message.
   *
   * @param context - Vuex Context
   * @param message - Message text
   */
  setMessage(
    context: ActionContext<RootState, RootState>,
    message: string = ''
  ) {
    context.commit('storeMessage', message);
  },
  /**
   * Set Error message
   *
   * @param context - Vuex Context
   * @param error - Error message etc.
   */
  setError(context: ActionContext<RootState, RootState>, error: string) {
    context.commit('storeError', error);
  },
  /**
   * Set search string
   *
   * @param context - Vuex Context
   * @param search - Search text
   */
  setSearch(
    context: ActionContext<RootState, RootState>,
    search: string = ''
  ) {
    context.commit('setSearch', search);
    if (search?.length > 2) {
      context.dispatch('fetchMovies', search);
    } else {
      context.commit('setMovies', []);
    }
  },

  /**
   * Fetch list of movie data
   *
   * @param context - Vuex Context
   * @param query - Search text
   */
  async fetchMovies(context: ActionContext<RootState, RootState>, query: string) {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=3de3c450&s=${query}`);
      const data = await response.json();
      // Handle the response data here
      if (data?.Response === "True" && data?.Search?.length) {
        context.commit('setMovies', data.Search);
        context.commit('storeMessage', "Movies found.");

      } 
      setTimeout(() => {
        context.commit('storeLoading', false);
      }, 500);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }
  },
  /**
   * Fetch movie detail data
   *
   * @param context - Vuex Context
   * @param query - Search text
   */
  async fetchMovieDetail(context: ActionContext<RootState, RootState>, query: string) {
    try {
      if (query?.length) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=3de3c450&i=${query}`);
        const data = await response.json();
        // Handle the response data here
        setTimeout(() => {
          if (data?.Response !== "False") {
            context.commit('storeMovieDetail', data);
            // context.commit('storeError', null);
            context.commit('storeMessage', "Look your movie details.");
          } else {
            context.commit('storeMovieDetail', null);
          }
          context.commit('storeLoading', false);
        }, 1000);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }
  },
  /**
   * Set movies list
   *
   * @param context - Vuex Context
   * @param movies - Movies list
   */
  setMovies(
    context: ActionContext<RootState, RootState>,
    movies: Movie[] = []
  ) {
    context.commit('setMovies', movies);
  },
  /**
   * Set selected item.
   *
   * @param context - Vuex Context
   * @param item - Selected item
   */
  setSelectedItem(
    context: ActionContext<RootState, RootState>,
    item: Movie | null
  ) {
    context.commit('setSelectedItem', item?.imdbID ? item : null);
  },
  /**
   * Set movie detail.
   *
   * @param context - Vuex Context
   * @param item - Selected item
   */
  setMovieDetail(
    context: ActionContext<RootState, RootState>,
    item: MovieDetail | null) {
    context.commit('storeMovieDetail', item ? item : null);
  },
  /**
   * Toggle favorite status of a movie
   *
   * @param context - Vuex Context
   * @param movie - movie to toggle favorite status
   */
  toggleFavorite(
    context: ActionContext<RootState, RootState>,
    movie: WritableComputedRef<MovieDetail>
  ) {
    const { commit, state } = context;
    const isFound = state.favorites.find((m: MovieDetail) => m.imdbID === movie.value.imdbID);
    if (isFound) {
      const updatedFavorites = state.favorites.filter((m: MovieDetail) => m.imdbID !== movie.value.imdbID);
      commit('storeFavorites', updatedFavorites);
    } else {
      const clonedMovie = JSON.parse(JSON.stringify(movie.value));
      const updatedFavorites = [...state.favorites, clonedMovie];
      commit('storeFavorites', updatedFavorites);
    }
  },
};

/** VuexStore */
const store: StoreOptions<RootState> = {
  // https://vuex.vuejstate.org/guide/strict.html#development-vs-production
  strict: import.meta.env.DEV,
  state,
  getters,
  mutations,
  actions,
  modules: {
    ConfigModule,
  },
  plugins: [
    new VuexPersistence({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE || 'vuex',
      storage: window.localStorage,
      modules: ['ConfigModule'],
    }).plugin,
    /*
    // store as session storage
    new VuexPersistence({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
      storage: window.sessionStorage,
      modules: ['SomeModule'],
    }).plugin,
    // store as Indexed DB (using vuex-persist-indexeddb)
    createPersistedState({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
      paths: ['SomeLargeModule'],
    }),
    */
  ],
};

export default createStore(store);
