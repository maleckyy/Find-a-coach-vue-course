<template>
  <section>
    <base-card>
      <h2>Register as coach</h2>
    </base-card>
    <coach-form @save-data="saveData"></coach-form>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
export default {
  components: { CoachForm },
  methods: {
    saveData(data) {
      this.$store.dispatch('coaches/registerCoach', data);
      this.$router.replace('/');
    },
  },
};
</script>

<style scoped></style>
