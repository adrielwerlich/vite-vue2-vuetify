<template>
  <v-container class="text-center">
    <v-row class="my-3">

      <v-col cols="12">
        <p v-text="msg" />
      </v-col>

      <v-col class="mb-5" cols="12" v-if="movieDetail">
        <h2 class="text-h5 font-weight-bold mb-3" >
          {{ movieDetail?.Title ?? '' }}
        </h2>

        <v-row justify="center">
          <movie-card />
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, type WritableComputedRef, } from 'vue';

import MovieCard from './MovieCard.vue';
import { useStore } from '@logue/vue2-helpers/vuex';

import type { MovieDetail } from '@/interfaces/MovieInterface';

export default defineComponent({
  /** Components */
  components: {
    MovieCard,
  },
  props: {
    /** Message */
    msg: { type: String, default: undefined },
  },
  setup() {
    /** Vuex */
    const store = useStore();

    /** Movies detail */
    const movieDetail: WritableComputedRef<MovieDetail> = computed(() => store?.getters?.movieDetail ?? null);

    return {
      movieDetail,
    };
  },
});
</script>
