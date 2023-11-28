<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title class="show-on-big-screen">{{ title }}</v-app-bar-title>
      <v-spacer />
      <div class="search-input-container">
        <v-autocomplete v-model="selectedItem" density="compact" class="search-input" :items="moviesData"
          :search-input.sync="search" hide-selected item-text="name" item-value="name" return-object
          label="Search your movie" placeholder="Start typing to Search" clearable></v-autocomplete>
      </div>
      <app-bar-menu-component />
      <v-progress-linear :active="loading" :indeterminate="progress === null" :value="progress" absolute bottom
        color="primary accent-3" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <drawer-component />
    </v-navigation-drawer>

    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>

    <v-overlay v-show="loading" z-index="999">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar v-model="snackbar" app timeout="5000" transition="scroll-y-transition">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn color="primary" icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <teleport to="head">
      <meta name="theme-color" :content="theme.currentTheme.primary?.toString()" />
      <link rel="icon" :href="logo" type="image/svg+xml" />
    </teleport>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
  type SetupContext,
  type WritableComputedRef,
} from 'vue';

import { useTheme } from '@logue/vue2-helpers/vuetify';
import { useStore } from '@logue/vue2-helpers/vuex';
import { useRoute, useRouter } from 'vue-router/composables';

import logo from '@/assets/vuetify.svg';
import AppBarMenuComponent from '@/components/AppBarMenuComponent.vue';
import DrawerComponent from '@/components/DrawerComponent.vue';
import type { Movie } from './interfaces/MovieInterface';

/** App */
export default defineComponent({
  components: {
    AppBarMenuComponent,
    DrawerComponent,
  },
  /**
   * Setup
   *
   * @param _props - Props
   * @param _context - Context
   */
  setup: (_props, _context: SetupContext) => {
    /** Vuex */
    const store = useStore();
    /** Router */
    const router = useRouter();
    /** Router */
    const route = useRoute();
    /** Vuetify Theme */
    const theme = useTheme();

    /** SelectedItem */
    // const selectedItem: Ref<Movie | null> = ref(null);
    const selectedItem: WritableComputedRef<string> = computed({
      get: () => store.getters.selectedItem,
      set: v => {
        if (!v || v?.length === 0) return;
        loading.value = true;
        const regex = /imdbID: (\w+)/;
        const match = v.match(regex);
        const imdbID = match ? match[1] : null;
        store.dispatch('fetchMovieDetail', imdbID);
        store.dispatch('setSelectedItem', v);
        if (route.name !== 'Home') router.push({ name: 'Home' });
      },
    });

    /** Title */
    const title: Ref<string> = ref(
      import.meta.env.VITE_APP_TITLE || 'List and favorite your movies'
    );
    /** Drawer menu visibility */
    const drawer: Ref<boolean> = ref(false);
    /** Snackbar visibility */
    const snackbar: Ref<boolean> = ref(false);


    /** Snackbar text */
    const snackbarText: WritableComputedRef<string> = computed({
      get: () => store.getters.message,
      set: v => store.dispatch('setMessage', v),
    });

    /** progress percentage */
    const progress: WritableComputedRef<number> = computed({
      get: () => store.getters.progress,
      set: v => store.dispatch('setProgress', v),
    });

    /** loading overlay visibility */
    const loading: WritableComputedRef<boolean> = computed({
      get: () => store.getters.loading,
      set: v => store.dispatch('setLoading', v),
    });

    /** Error Message */
    const error: ComputedRef<boolean> = computed(() => store.getters.error);

    /** When route change, hide snackbar */
    watch(
      () => route?.name,
      () => {
        snackbar.value = false;
        onSnackbarChanged();
      }
    );

    /** When loading */
    watch(
      loading,
      isloading => (document.body.style.cursor = isloading ? 'wait' : 'auto')
    );

    /** When error has occurred */
    watch(error, () => router.push({ name: 'Error' }));

    // When snackbar text has been set, show snackbar.
    watch(
      () => snackbarText.value,
      async value => {
        snackbar.value = value !== '';
        await nextTick();
      }
    );

    /** Run once. */
    onMounted(() => {
      document.title = title.value;
      loading.value = false;
    });

    /** Clear store when snackbar hide */
    const onSnackbarChanged = async () => {
      store.dispatch('setMessage');
      await nextTick();
    };

    /** Search */
    const search: WritableComputedRef<string> = computed({
      get: () => store.getters.search,
      set: v => store.dispatch('setSearch', v),
    });

    /** Movies list */
    const moviesData: WritableComputedRef<string[]> = computed({
      get: () => store.getters.movies.map((movie: Movie) => `Title: ${movie.Title}, Year: ${movie.Year}, Type: ${movie.Type}, imdbID: ${movie.imdbID}`),
      set: (v: string[]) => store.dispatch('setMovies', v),
    });

    return {
      moviesData,
      selectedItem,
      search,
      logo,
      theme,
      title,
      drawer,
      snackbar,
      snackbarText,
      progress,
      loading,
      error,
      onSnackbarChanged,
    };
  },
});
</script>

<style lang="scss">
@import '~/vuetify/src/styles/styles';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;
  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map-get($grey, 'lighten-2') map-get($grey, 'base');
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
  background-color: map-get($grey, 'lighten-2');
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map-get($grey, 'base');
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  max-width: 600px;
  top: 25%;
}

.search-input-container {
  width: 83%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-self: stretch;
}

@media (max-width: 1500px) {
  .show-on-big-screen {
    display: none;
  }
}

@media (min-width: 1500px) {
  .search-input {
    position: absolute;
    right: 35%;
  }
}

</style>
