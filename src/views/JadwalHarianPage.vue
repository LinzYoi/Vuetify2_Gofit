<template>
  <v-main class="pegawaiBackground">
    <div class="content-style">
      
      <v-card>
        <div class="d-flex">
          <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <div class="ml-auto mt-3">
            <v-btn class="ma-2" outlined fab color="indigo" @click="dialog = true">
            <v-icon>{{ icons.mdiPlus }}</v-icon></v-btn>
          </div>
          <div class="mr-3 mt-3">
            <v-btn class="ma-2" outlined fab color="indigo" @click="dialogDeleteAll = true">
            <v-icon>{{ icons.mdiDelete }}</v-icon></v-btn>
          </div>
        </div>

        <template>                    
          <v-data-table :headers="headers" :items="jadwalHarians" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
          </v-data-table>
        </template>
      </v-card>
    
      <!-- Dialog Generate -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="370px">
          <v-card>
            <v-card-title>
              <span class="headline">Generate Jadwal Harian</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancel()">Cancel</v-btn>            
              <v-btn color="blue darken-1" text @click="saveJadwalHarian()">Yes</v-btn>            
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
        
      <!-- Dialog Confirm for delete -->
      <v-row justify="center">
        <v-dialog v-model="dialogDeleteAll" max-width="400">
          <v-card>
            <v-card-title class="text-h5">Are you sure to delete all data?</v-card-title>
            <v-card-text> Tindakan ini akan menghapus jadwal harian! </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialogDeleteAll = false">No</v-btn>
              <v-btn color="green darken-1" text @click="deleteAllData()">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    
      <v-snackbar v-model="snackbar" :color="color" bottom>{{ error_message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Tutup
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-main>
</template>

<script>
import { mdiPlus, mdiPencil, mdiDelete, mdiEye } from "@mdi/js";

export default {
  data() {
    return {
      icons: {
        mdiPlus,
        mdiPencil,
        mdiDelete,
        mdiEye,
      },
      deleteId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,
      
      kelass: [],
      instrukturs: [],
      jadwalUmums: [],
      jadwalHarians: [],      

      error_message: "",
      color: "",
      dialog: false,
      dialogDeleteAll: false,
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {        
      },
      error: {
      },
      items: [
        { text: "...", disabled: true },
        { text: "Jadwal Harian", disabled: false },
      ],
      headers: [        
        { text: "Hari", value: "jadwal_umum_foreign_key.hari" },
        { text: "Jam", value: "jadwal_umum_foreign_key.jam" },
        { text: "Kelas", value: "jadwal_umum_foreign_key.kelas_foreign_key.nama_kelas" },
        { text: "Instruktur", value: "instruktur_foreign_key.nama_instruktur" },
        { text: "Status", value: "status" },
        { text: "Tanggal", value: "tanggal" },
        { text: "Slot Kelas", value: "slot_kelas" },                     
      ],
    };
  },  
  watch: {
    dialogLoading(val) {
      if (!val) return;

      setTimeout(() => (this.dialogLoading = false), 1000);
    },
  },
  computed: {
    selectedInstruktur() {
      // Menggunakan computed property untuk mengambil data instruktur yang dipilih berdasarkan ID
      return this.instrukturs.find((instruktur) => instruktur.id_instruktur === this.form.id_instruktur) || {};
    },
    selectedJadwalUmum() {
      // Menggunakan computed property untuk mengambil data jadwal umum yang dipilih berdasarkan ID
      return this.jadwalUmums.find((jadwal_umum) => jadwal_umum.id_jadwal_umum === this.form.id_jadwal_umum) || {};
    },
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataInstruktur();    
    this.getDataJadwalUmum();
    this.getDataJadwalHarian();
  },
  methods: {
    setForm() {                
      this.saveJadwalHarian();      
    },
    getDataInstruktur() {
      this.load = true;
      var url = this.$api + "/instruktur";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.instrukturs = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    getDataJadwalUmum() {
      this.load = true;
      var url = this.$api + "/jadwalUmum";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.jadwalUmums = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    getDataJadwalHarian() {
      this.load = true;
      var url = this.$api + "/jadwalHarian";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.jadwalHarians = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    saveJadwalHarian() {            
      var url = this.$api + "/jadwalHarian";
      this.load = true;
      this.$http
        .post(url, {}, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Generate Success";
          this.color = "black";
          this.snackbar = true;
          this.load = true;
          this.close();
          this.getDataJadwalHarian();          
        })
        .catch(() => {
          this.error_message = "Generate Failed";
          this.color = "black";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
          this.close();
        });
    },
    
    deleteAllData() {
      var url = this.$api + "/jadwalHarian/";
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.getDataJadwalHarian();          
          location.reload();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "black";
          this.snackbar = true;
          this.load = false;
        });
    },
    cancel() {
      this.dialog = false;
      this.dialogConfirmEdit = false;
      this.inputType = "Add";
      (this.error = {
        tanggal: false,
        hari: false,
        jam: false,
      }),        
      this.getDataJadwalHarian();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataJadwalHarian();
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;      
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_jadwal_harian;
      this.form.id_instruktur = item.id_instruktur;            
      this.form.hari = item.hari;
      this.form.jam = item.jam;
      this.form.status = item.status;
      this.dialog = true;
    },
    deleteHandler(id_jadwal_harian) {
      this.deleteId = id_jadwal_harian;
      this.dialogConfirm = true;
    },
    getHandler(item) {
      this.editId = item.id_jadwal_harian;
      this.form.id_instruktur = item.id_instruktur;
      this.form.id_jadwal_umum = item.id_jadwal_umum;      
      this.form.hari = item.hari;
      this.form.jam = item.jam;
      this.form.status = item.status;
      this.dialogShowDetails = true;
    },
  },
};
</script>

<style scoped>

.pegawaiBackground {
  background-color: rgb(255, 102, 36);
  height: 1000vh;
  transition: background-color 2s ease-in-out;
}

.pegawaiBackground:hover {
  background-color: rgb(99, 0, 205);
}

.content-style {
  margin-top: 10%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 10%;
}
</style>