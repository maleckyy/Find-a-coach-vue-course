export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [],
    };
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimeStamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  actions: {
    async registerCoach(context, data) {
      const userId = context.rootGetters.userId;
      const coachData = {
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas,
      };
      const token = context.rootGetters.token;

      const response = await fetch(
        `https://vue-project-1a684-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,
        {
          method: 'PUT',
          body: JSON.stringify(coachData),
        }
      );

      // const responseData = await response.json();
      if (!response.ok) {
        // error..
      }

      context.commit('registerCoach', { ...coachData, id: userId });
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return;
      }

      const response = await fetch(
        'https://vue-project-1a684-default-rtdb.europe-west1.firebasedatabase.app/coaches.json'
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error({ message: 'Failed to fetch' });
      }

      const coaches = [];
      for (const key in responseData) {
        const coach = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
          areas: responseData[key].areas,
        };
        coaches.push(coach);
      }
      context.commit('setCoaches', coaches);
      context.commit('setFetchTimeStamp');
    },
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },

    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const current = new Date().getTime();
      return (current - lastFetch) / 1000 > 60;
    },
  },
};
