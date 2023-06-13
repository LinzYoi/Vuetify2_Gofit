<template>
  <v-main class="pegawaiBackground">
    <div class="content-style">
      
      <v-card>
        <v-card-title>
          Tabel Izin Instruktur
        </v-card-title>
        <div class="d-flex">
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <div class="ml-auto mr-3 mt-3">
            <!-- <v-btn class="ma-2" outlined fab color="indigo" @click="dialog = true">
                <v-icon>{{ icons.mdiPlus }}</v-icon>
            </v-btn> -->
          </div>
        </div>

        <!-- tabel semua izin -->
        <template>
          <v-data-table :headers="headers" :items="perizinanInstrukturs" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">              
              <v-icon class="mr-2" @click="izinHandler(item.id_perizinan)">{{ icons.mdiAlert }}</v-icon>
              <v-icon class="mr-2" @click="getHandler(item)">{{ icons.mdiEye }}</v-icon>
            </template>
          </v-data-table>
        </template>      
      </v-card>

      <v-card class="mt-3">
        <v-card-title>
          Tabel Izin Instruktur Yang Belum Dikonfirmasi
        </v-card-title>
        <div class="d-flex">
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
        </div>

      <!-- tabel izin blm dikonfirmasi-->
        <template>
          <v-data-table :headers="headers" :items="perizinanInstruktursNotConfirmed" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">              
              <v-icon class="mr-2" @click="izinHandler(item.id_perizinan)">{{ icons.mdiAlert }}</v-icon>
              <v-icon class="mr-2" @click="getHandler(item)">{{ icons.mdiEye }}</v-icon>
            </template>
          </v-data-table>
        </template>
      </v-card>
      
      <!-- Dialog Show Details -->
      <v-row justify="center">
        <v-dialog v-model="dialogShowDetails" max-width="400px" persistent>
          <v-card>
            <v-card-title class="background-color">
              <span class="headline text-center text-color">Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div>                                               
                  <v-text-subtitle>Instruktur : {{ selectedInstruktur.nama_instruktur }}</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Id Jadwal Harian : {{ selectedJadwalHarian.id_jadwal_harian }}</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Tanggal Perizinan Kelas: {{ form.tanggal_perizinan }}</v-text-subtitle>    
                  <br>
                  <v-text-subtitle>Tanggal Pembuatan Perizinan : {{ form.tanggal_pembuatan_perizinan }}</v-text-subtitle>    
                  <br>
                  <v-text-subtitle>Tanggal Konfirmasi Perizinan : {{ form.tanggal_konfirmasi_perizinan }}</v-text-subtitle>    
                  <br>
                  <v-text-subtitle>Status : {{ form.status_perizinan }}</v-text-subtitle>    
                  <br>
                  <v-text-subtitle>Keterangan : {{ form.keterangan_perizinan }}</v-text-subtitle>
                  <br>                                                              
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogShowDetails"
              >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <!-- Dialog Confirm Perizinan  -->
      <v-row justify="center">      
        <v-dialog v-model="dialogConfirmPerizinan" max-width="500">
          <v-card>
            <v-card-title class="text-h5">Are you sure to Confirm this Permission?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialogConfirmPerizinan = false" >No</v-btn>
              <v-btn color="green darken-1" text @click="konfirmasiPerizinan">Yes</v-btn>
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
import { mdiPlus, mdiPencil, mdiDelete, mdiEye, mdiAlert } from "@mdi/js";

export default {
  data() {
    return {
      icons: {
        mdiPlus,
        mdiPencil,
        mdiDelete,
        mdiEye,
        mdiAlert,
      },
      deleteId: "",
      perizinanId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,

      instrukturs: [],
      jadwalHarians: [],      
      perizinanInstrukturs: [],
      perizinanInstruktursNotConfirmed: [],
      perizinanInstruktur: new FormData(),

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogConfirmPerizinan: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {
        id_instruktur: "",
        id_jadwal_harian: "",
        tanggal_perizinan: "",
        tanggal_pembuatan_perizinan: "",
        tanggal_konfirmasi_perizinan: "",
        status_perizinan: "",
        keterangan_perizinan: "",
        // instruktur_foreign_key{
        //     nama_instruktur: "",
        //     },
        // },
      },
      error: {
        id_instruktur: [(v) => !!v || "Nama Instruktur is required"],
        id_kelas: [(v) => !!v || "Nama Kelas is required"],
        tanggal: [(v) => !!v || "Tanggal is required"],
        hari: [(v) => !!v || "Hari is required"],
        jam: [(v) => !!v || "Jam is required"],
      },
      items: [
        { text: "...", disabled: true },
        { text: "Jadwal Umum", disabled: false },
      ],
      headers: [
        { text: "Nama Instruktur", value: "instruktur_foreign_key.nama_instruktur" },
        { text: "Nama Kelas", value: "jadwal_harian_foreign_key.jadwal_umum_foreign_key.kelas_foreign_key.nama_kelas" },        
        { text: "Tanggal Perizinan Kelas", value: "tanggal_perizinan" },
        { text: "Tanggal Pembuatan Izin", value: "tanggal_pembuatan_perizinan" },
        { text: "Tanggal Konfirmasi", value: "tanggal_konfirmasi_perizinan" },
        { text: "Status", value: "status_perizinan" },
        { text: "Keterangan", value: "keterangan_perizinan" },
        { text: "Actions", value: "actions" },
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
    selectedJadwalHarian() {
      // Menggunakan computed property untuk mengambil data jadwal harian yang dipilih berdasarkan ID
      return this.jadwalHarians.find((jadwal_harian) => jadwal_harian.id_jadwal_harian === this.form.id_jadwal_harian) || {};
    },    
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataInstruktur();    
    this.getDataJadwalHarian();
    this.getDataPerizinanInstruktur();
    this.getDataPerizinanInstrukturNotConfirmed();
  },
  methods: {
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
    getDataPerizinanInstruktur() {
      this.load = true;
      var url = this.$api + "/perizinanInstruktur";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.perizinanInstrukturs = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    getDataPerizinanInstrukturNotConfirmed() {
      this.load = true;
      var url = this.$api + "/perizinanInstrukturNotConfirmed";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.perizinanInstruktursNotConfirmed = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    konfirmasiPerizinan() {
      var url = this.$api + "/perizinanInstruktur/" + this.perizinanId;
      this.$http
        .put(url,{}, {
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
          this.getDataPerizinanInstruktur();
          this.getDataPerizinanInstrukturNotConfirmed();
          location.reload();          
        })
        .catch((error) => {          
          this.error_message = error.response.data.message;          
          this.color = "black";
          this.snackbar = true;
          this.load = false;
          this.close();
        });
    },

    close() {
      this.dialog = false;            
      this.dialogConfirmPerizinan = false;
      this.getDataPerizinanInstruktur();
      this.getDataPerizinanInstrukturNotConfirmed();
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;      
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_jadwal_umum;
      this.form.id_instruktur = item.id_instruktur;
      this.form.id_kelas = item.id_kelas;
      this.form.tanggal = item.tanggal;
      this.form.hari = item.hari;
      this.form.jam = item.jam;
      this.dialog = true;
    },
    deleteHandler(id_jadwal_umum) {
      this.deleteId = id_jadwal_umum;
      this.dialogConfirm = true;
    },
    izinHandler(id_perizinan) {
      this.perizinanId = id_perizinan;
      this.dialogConfirmPerizinan = true;
    },
    getHandler(item) {
      this.editId = item.id_perizinan;
      this.form.id_instruktur = item.id_instruktur;
      this.form.id_jadwal_harian = item.id_jadwal_harian;
      this.form.tanggal_perizinan = item.tanggal_perizinan;
      this.form.tanggal_pembuatan_perizinan = item.tanggal_pembuatan_perizinan;
      this.form.tanggal_konfirmasi_perizinan = item.tanggal_konfirmasi_perizinan;
      this.form.status_perizinan = item.status_perizinan;
      this.form.keterangan_perizinan = item.keterangan_perizinan;              
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