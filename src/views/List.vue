<template>
  <div class="my-5 text-center">
    <h1>CRUD de Pacientes</h1>

    <div v-if="getFireResponse.errored">
      <p v-text="getFireResponse.text" class="text-danger"></p>
    </div>

    <div v-else class="px-0">
      <div v-if="getFireResponse.loading" class="text-center px-0">
        <p>Cargando...</p>
        <div class="text-center mt-3">
          <b-spinner variant="dark" label=""></b-spinner>
        </div>
      </div>

      <div v-else>

        <p v-if="getPatients.length==0" class="text-danger mt-5">No hay documentos en la colección Pacientes</p>

        <b-container v-else class="mt-5">
          <b-table hover :items="getPatients" :fields="fields" responsive>
            <!-- A virtual column -->
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <!--Buttons-->
            <template #cell(key)="data">
              <b-button variant="success" @click="editPat(data.value,data.index+1,data.item.nombre,data.item.correo)">
                Editar</b-button>
              <b-button class="ms-3" variant="danger" @click="deletePat(data.value, data.item.nombre)">Eliminar
              </b-button>
            </template>
          </b-table>
        </b-container>

        <b-button class="mt-5" variant="primary" @click="addPacient()">Agregar Paciente</b-button>
      </div>

      <!--Modal Edit-->
      <b-modal id="edit-modal" ref="edit-modal" :title="'Edición de Paciente, indice: '+form.index"
        @hidden="resetFormData" @ok="handleOkEdit" hide-header-close>

        <form ref="form" @submit.stop.prevent="handleSubmitEdit">
          <b-form-group label="Nombre" label-for="name-input"
            invalid-feedback="Nombre es requerido con al menos 2 caracteres" :state="form.state.nombre">
            <b-form-input type="text" id="name-input" v-model="form.nombre" :state="form.state.nombre" minlength="2"
              required>
            </b-form-input>
          </b-form-group>

          <b-form-group label="Correo" label-for="email-input" invalid-feedback="Correo es requerido"
            :state="form.state.correo">
            <b-form-input type="email" input id="email-input" v-model="form.correo" :state="form.state.correo" required>
            </b-form-input>
          </b-form-group>
        </form>

      </b-modal>

      <!--Modal Delete-->
      <b-modal id="delete-modal" @hidden="resetFormData" @ok="handleOkDelete" hide-header-close>¿Esta seguro que
        desea
        realizar la eliminación de {{form.nombre}}?</b-modal>

      <!--Modal Informativo -->
      <b-modal id="info-modal" @ok="handleOkInfo" ok-only hide-header-close>{{modalInfo.text}}</b-modal>

    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'List',
    data() {
      return {
        fields: [
          // A virtual column that doesn't exist in items
          {
            key: 'index',
            label: '#'
          },
          {
            key: 'nombre',
            label: 'Nombre',
          },
          {
            key: 'correo',
            label: 'Correo',
          },
          {
            key: 'key',
            label: 'Acciones',
          },
        ],
        form: {
          selectedKey: '',
          index: '',
          nombre: '',
          correo: '',
          state: {
            nombre: null,
            correo: null,
          }
        },
        modalInfo: {
          text: '',
        },
      }
    },
    computed: {
      ...mapGetters(['getPatients', 'getFireResponse']),
    },
    created() {
      this.$store.dispatch('getPatientsDb');
    },
    methods: {
      resetFormData() {
        this.form.selectedKey = '';
        this.form.index = '';
        this.form.nombre = '';
        this.form.correo = '';
        this.form.state.nombre = null;
        this.form.state.correo = null;
      },
      editPat(key, indexAdd1, nombre, correo) {
        this.form.selectedKey = key;
        this.form.index = indexAdd1;
        this.form.nombre = nombre;
        this.form.correo = correo;
        this.$bvModal.show('edit-modal');
      },
      checkFormValidity() {
        const nameValid = document.getElementById('name-input').checkValidity();
        const emailValid = document.getElementById('email-input').checkValidity();

        this.form.state.nombre = nameValid;
        this.form.state.correo = emailValid;

        return (nameValid & emailValid);
      },
      handleSubmitEdit() {
        if (!this.checkFormValidity())
          return
        else {
          this.$store.dispatch('updatePatientDb', {
            key: this.form.selectedKey,
            data: {
              nombre: this.form.nombre,
              correo: this.form.correo
            }
          }).then(() => {
            this.$bvModal.hide('edit-modal')
            this.modalInfo.text = "Edición realizada correctamente"
            this.$bvModal.show('info-modal');
            this.resetFormData();
            this.$store.dispatch('getPatientsDb');
          })
        }
      },
      handleOkEdit(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmitEdit()
      },
      deletePat(key, nombre) {
        this.form.selectedKey = key;
        this.form.nombre = nombre;
        this.$bvModal.show('delete-modal');
      },
      handleOkDelete() {
        this.$store.dispatch('deletePatientDb', this.form.selectedKey)
          .then(() => {
            this.$bvModal.hide('delete-modal');
            this.modalInfo.text = "Eliminación realizada correctamente"
            this.$bvModal.show('info-modal');
            this.resetFormData();
            this.$store.dispatch('getPatientsDb');
          })
      },
      handleOkInfo() {
        this.modalInfo.text = ""
      },
      addPacient() {
        this.$router.push('/addpacient')
      },
    }
  }
</script>