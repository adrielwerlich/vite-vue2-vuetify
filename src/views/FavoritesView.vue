<template>
  <v-container class="favorites">
    <h1 class="text-center">Your favorite movies</h1>
    <v-row class="my-3" v-if="favorites?.length">
      <v-col class="mb-5" cols="12" sm="4" v-for="favorite in favorites" :key="favorite.imdbID">
        <h2 class="text-h5 font-weight-bold mb-3">
          {{ favorite?.Title ?? '' }}
        </h2>

        <v-row justify="center">
          <favorite-movie-card :movie="favorite" />
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@logue/vue2-helpers/vuex';
import type { MovieDetail } from '@/interfaces/MovieInterface';
import { useRouter } from 'vue-router/composables';
import FavoriteMovieCard from '../components/FavoriteMovieCard.vue';

/** About */
export default defineComponent({
  /** Components */
  components: {
    FavoriteMovieCard,
  },
  setup() {
    /** Vuex */
    const store = useStore();
    /** Router */
    const router = useRouter();

    const favorites = computed<MovieDetail[]>(() => store?.state?.favorites ?? []);

    // Redirect to home if favorites length is 0
    onMounted(() => {
      if (favorites.value.length === 0) {
        router.push({ name: 'Home' });
      }
    });
    

    console.log('favorites', favorites);

    /** Display snackbar */
    const showSnackbar = (message: string) => {
      store.dispatch('setMessage', message);
    };

    return { showSnackbar, favorites };
  },
});
</script>
