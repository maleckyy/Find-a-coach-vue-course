let timer;
export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async login(context, payload) {
      return context.dispatch('auth', { ...payload, mode: 'login' });
    },
    async signup(context, payload) {
      return context.dispatch('auth', { ...payload, mode: 'signup' });
    },
    async auth(context, payload) {
      const mode = payload.mode;
      let url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC6-VnD87UWD1HiPmRCY7Bsz7NAtMps0p4';
      if (mode === 'signup') {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6-VnD87UWD1HiPmRCY7Bsz7NAtMps0p4';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to authenticate.'
        );
        throw error;
      }
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.dispach('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');
      clearTimeout(timer);
      context.commit('setUser', {
        userId: null,
        token: null,
      });
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      if (token && userId) {
        context.commit('setUser', {
          token: token,
          userId: userId,
        });
      }
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('setAutoLogout');
    },
  },

  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token; //convert to bool
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};
