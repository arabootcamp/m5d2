<template>
  <div class="my-5">
    <b-container>
      <h1>Agregar Paciente</h1>

      <b-form @submit.prevent="onSubmitPatient" @reset="resetFormData" class="mt-5">

        <b-form-group label="Nombre" label-for="name-input"
          invalid-feedback="Nombre es requerido con al menos 2 caracteres" :state="form.state.nombre">
          <b-form-input type="text" id="name-input" v-model="form.nombre" :state="form.state.nombre" minlength="2"
            required>
          </b-form-input>
        </b-form-group>

        <b-form-group label="Correo" label-for="email-input" invalid-feedback="Correo es requerido"
          :state="form.state.correo" class="mt-3">
          <b-form-input type="email" input id="email-input" v-model="form.correo" :state="form.state.correo" required>
          </b-form-input>
        </b-form-group>

        <b-form-group class="mt-5">
          <b-button type="submit" variant="primary" formnovalidate>Agregar</b-button>
          <b-button type="reset" variant="secondary" class="ms-4">Restablecer</b-button>
          <b-button type="button" variant="warning" class="ms-4" @click="backTo()">Regresar</b-button>
        </b-form-group>
      </b-form>
      <p class="mt-5" :class="informative.color">{{informative.text}}</p>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'AddPatient',
    data() {
      return {
        form: {
          nombre: '',
          correo: '',
          state: {
            nombre: null,
            correo: null,
          }
        },
        informative: {
          text: '',
          color: 'text-dark',
        }
      }
    },
    methods: {
      resetFormData() {
        this.form.nombre = '';
        this.form.correo = '';
        this.form.state.nombre = null;
        this.form.state.correo = null;
      },
      checkFormValidity() {
        const nameValid = document.getElementById('name-input').checkValidity();
        const emailValid = document.getElementById('email-input').checkValidity();

        this.form.state.nombre = nameValid;
        this.form.state.correo = emailValid;

        return (nameValid & emailValid);
      },
      onSubmitPatient() {
        if (!this.checkFormValidity())
          return
        else {
          this.$store.dispatch('addPatientDb', {
            nombre: this.form.nombre,
            correo: this.form.correo
          }).then(() => {
            this.informative.text =
              `El paciente: ${this.form.nombre} con correo: ${this.form.correo} se agrego correctamente`;
            this.informative.color = "text-success";
          }).catch((e) => {
            console.error("Error al Agregar Paciente: " + e)
            this.informative.text =
              `Problemas al agregar al paciente: ${this.form.nombre} con correo: ${this.form.correo}, intente más tarde`;
            this.informative.color = "text-danger";
          }).finally(() => {
            this.resetFormData();
          })
        }
      },
      backTo() {
        this.$router.go(-1);
      }
    }
  }
</script>