<template>
  <div>
    <base-dialog :show="!!error" title="Error" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed title="Auth" :show="isLoading">
      <p>Authenticating...</p>
      <base-spinner></base-spinner
    ></base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Enter email and password (at least 6 characters long)
        </p>
        <base-button>{{ sumbitButtonCaption }}</base-button>
        <base-button @click="switchMode" type="button" mode="flat">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  computed: {
    sumbitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Sign up';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    },
  },
  methods: {
    handleError() {
      this.error = null;
    },
    async submitForm() {
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }
      this.isLoading = true;

      try {
        if (this.mode === 'login') {
          // ...
        } else {
          await this.$store.dispatch('signup', {
            email: this.email,
            password: this.password,
          });
        }
      } catch (error) {
        this.error = error.message || 'Failed to auth';
      }
      this.isLoading = false;
    },
    switchMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
  },
};
</script>
<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
