<template>
  <v-card class="mx-auto" max-width="544" v-if="movieDetail">
    <v-img content-class="background-position-top" v-if="movieDetail?.Poster" :src="movieDetail.Poster"
      height="300px"></v-img>

    <v-card-title>
      Released: {{ movieDetail?.Released }}
    </v-card-title>

    <v-card-subtitle>
      {{ movieDetail?.Runtime ? `Runtime: ${movieDetail?.Runtime}` : '' }}
      <v-spacer></v-spacer>
      {{ movieDetail?.imdbRating ? `imdbRating: ${movieDetail?.imdbRating}` : '' }}
      <v-spacer></v-spacer>
      {{ movieDetail?.imdbVotes ? `imdbVotes: ${movieDetail?.imdbVotes}` : '' }}
      <v-spacer></v-spacer>
      {{ movieDetail?.Country ? `Country: ${movieDetail?.Country}` : '' }}
      <v-spacer></v-spacer>
      {{ movieDetail?.BoxOffice ? `BoxOffice: ${movieDetail?.BoxOffice}` : '' }}

    </v-card-subtitle>


    <v-card-actions v-if="movieDetail?.Actors?.length">
      <v-btn disabled color="orange-lighten-2" variant="text">
        Actors:
      </v-btn>
      <v-badge v-for="actor in movieDetail?.Actors.split(',')" :content="actor" :color="getRandomColor()" inline>
      </v-badge>
      <v-spacer></v-spacer>
      <v-btn @click="toggleFavorite" color="orange-lighten-2" variant="text">
        Like

        <v-icon v-if="isFavorite" left>mdi-heart</v-icon>
        <v-icon v-else left>mdi-heart-outline</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="true">
        <v-divider></v-divider>

        <v-card-text>
          {{ movieDetail?.Plot ? `Plot: ${movieDetail?.Plot}` : '' }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script lang="ts">
import { onMounted, defineComponent, computed, type WritableComputedRef, type PropType } from 'vue';
import { useStore } from '@logue/vue2-helpers/vuex';
import { type MovieDetail } from '@/interfaces/MovieInterface';

export default defineComponent({
  setup() {
    const store = useStore();
    const movieDetail: WritableComputedRef<MovieDetail> = computed(() => store?.getters?.movieDetail ?? null);

    const isFavorite = computed(() => {
      if (movieDetail.value) {
        return store?.getters?.favorites.some((movie: MovieDetail) => {
          return movie.imdbID === movieDetail.value.imdbID;
        });
      }
      return false;
    });

    const getRandomColor = () => {
      const colors = ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const toggleFavorite = () => {
      store.dispatch('toggleFavorite', movieDetail);
    };

    return {
      isFavorite,
      toggleFavorite,
      getRandomColor,
      movieDetail,
    };
  }
});
</script>