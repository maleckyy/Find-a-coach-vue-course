<template>
  <div>
    <base-dialog :show="!!error" title="Error" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilter"></coach-filter>
    </section>

    <section>
      <base-card>
        <!-- list of coaches -->
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button v-if="!isCoach && !isLoading" link to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div v-if="isLoading"><base-spinner></base-spinner></div>
        <ul v-if="hasCoaches && !isLoading">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          >
          </coach-item>
        </ul>
        <h3 v-if="!hasCoaches">No coaches</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import coachItem from '../../components/coaches/coachItem.vue';
export default {
  components: { coachItem, CoachFilter },
  data() {
    return {
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
      isLoading: false,
      error: null,
    };
  },
  computed: {
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },
    filteredCoaches() {
      const coaches = this.$store.getters['coaches/coaches']; // namespace/getter name
      return coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return this.$store.getters['coaches/hasCoaches'];
    },
  },
  methods: {
    setFilter(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  created() {
    this.loadCoaches();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
