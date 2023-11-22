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
    <label style="margin: 0 1rem;">Set Score: 1-5</label>
    <v-row align="center" style="margin: auto; margin: 0 1rem;">
      <v-btn color="red" @click="handleDecrease" small>-</v-btn>
      <v-text-field type="text" :value="value" disabled width="65px" class="input-score" label=""></v-text-field>
      <v-btn color="primary" @click="handleIncrease" small>+</v-btn>
    </v-row>


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
import { defineComponent, type PropType, ref } from 'vue';
import { type MovieDetail } from '@/interfaces/MovieInterface';

export default defineComponent({
  props: {
    movie: {
      type: Object as PropType<MovieDetail>,
      default: null as MovieDetail | null,
    },
  },
  setup(props) {

    const getRandomColor = () => {
      const colors = ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const value = ref(props.movie.Score || 1);

    const handleDecrease = () => {
      if (value.value > 1) {
        value.value--;
      }
      props.movie.Score = value.value;
    };

    const handleIncrease = () => {
      if (value.value < 5) {
        value.value++;
      }
      props.movie.Score = value.value;
    };

    console.log('props.movie.Score', props.movie.Score);

    return {
      value,
      handleDecrease,
      handleIncrease,
      getRandomColor,
    };
  }
});
</script>

<style>
.v-input input {
  text-align: center !important;
}

.input-score {
  margin: 0 10px;
  min-width: 100px;
}
</style>