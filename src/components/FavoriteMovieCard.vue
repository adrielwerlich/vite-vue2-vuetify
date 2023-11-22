<template>
  <v-card class="mx-auto" max-width="544" v-if="movie">
    <v-img content-class="background-position-top" v-if="movie?.Poster" :src="movie.Poster" height="300px"></v-img>

    <v-card-title>
      Released: {{ movie?.Released }}
    </v-card-title>

    <v-card-subtitle>
      {{ movie?.Runtime ? `Runtime: ${movie?.Runtime}` : '' }}
      <v-spacer></v-spacer>
      {{ movie?.imdbRating ? `imdbRating: ${movie?.imdbRating}` : '' }}
      <v-spacer></v-spacer>
      {{ movie?.imdbVotes ? `imdbVotes: ${movie?.imdbVotes}` : '' }}
      <v-spacer></v-spacer>
      {{ movie?.Country ? `Country: ${movie?.Country}` : '' }}
      <v-spacer></v-spacer>
      {{ movie?.BoxOffice ? `BoxOffice: ${movie?.BoxOffice}` : '' }}

    </v-card-subtitle>


    <v-card-actions v-if="movie?.Actors?.length">
      <v-btn disabled color="orange-lighten-2" variant="text">
        Actors:
      </v-btn>
      <v-badge v-for="actor in movie?.Actors.split(',')" :content="actor" :color="getRandomColor()" inline>
      </v-badge>
      <v-spacer></v-spacer>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="true">
        <v-divider></v-divider>

        <v-card-text>
          {{ movie?.Plot ? `Plot: ${movie?.Plot}` : '' }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type MovieDetail } from '@/interfaces/MovieInterface';

export default defineComponent({
  props: {
    movie: {
      type: Object as PropType<MovieDetail>,
      default: null as MovieDetail | null,
    },
  },
  setup() {

    const getRandomColor = () => {
      const colors = ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    return {
      getRandomColor,
    };
  }
});
</script>