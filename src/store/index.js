import Vue from 'vue'
import Vuex from 'vuex'
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import {
  dbFire
} from '@/config/firebaseConfig.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    patients: [],
    fireResponse: {
      loading: true,
      errored: false,
      text: '',
    },
  },
  getters: {
    getPatients: state => state.patients,
    getFireResponse: state => state.fireResponse,
  },
  mutations: {
    mutaPatients(state, dbPatients) {
      state.patients = dbPatients;
    },
    mutaFireResponse: (state, response) => {
      state.fireResponse.loading = response.loading;
      state.fireResponse.errored = response.errored;
      state.fireResponse.text = response.text;
    },
  },
  actions: {
    async getPatientsDb({
      commit
    }) {
      try {
        //valores previo a consultar firestore
        commit('mutaFireResponse', {
          loading: true,
          errored: false,
          text: ''
        });
        let patientsLst = [];
        const querySnapshot = await getDocs(collection(dbFire, "Pacientes"));
        querySnapshot.forEach((doc) => {
          patientsLst.push({
            key: doc.id,
            ...doc.data()
          });
        });
        commit('mutaPatients', patientsLst);
        commit('mutaFireResponse', {
          loading: false,
          errored: false,
          text: ''
        });
      } catch (e) {
        console.error("Error getAddPatients: ", e);
        commit('mutaFireResponse', {
          loading: false,
          errored: true,
          text: 'Error al consultar firestore Paciente'
        });
      }
    },
    async updatePatientDb(context, payload) {
      await setDoc(doc(dbFire, "Pacientes", payload.key), payload.data);
    },
    async deletePatientDb(context, delKey) {
      await deleteDoc(doc(dbFire, "Pacientes", delKey));
    },
    async addPatientDb(context, patient) {
      await addDoc(collection(dbFire, "Pacientes"), patient);
    },
  },
  modules: {}
})