<template>
  <v-main class="pegawaiBackground">
    <div class="content-style">
      
      <v-card>
        <div class="d-flex">
          <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <div class="ml-auto mr-3 mt-3">
            <v-btn class="ma-2" outlined fab color="indigo" @click="dialog = true">
            <v-icon>{{ icons.mdiPlus }}</v-icon></v-btn>
          </div>
        </div>

        <template>                    
          <v-data-table :headers="headers" :items="jadwalUmums" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="mr-2" @click="editHandler(item)">{{ icons.mdiPencil }}</v-icon>
              <v-icon class="mr-2" @click="deleteHandler(item.id_jadwal_umum)">{{ icons.mdiDelete }}</v-icon>
              <!-- <v-icon class="mr-2" @click="getHandler(item)">{{ icons.mdiEye }}</v-icon> -->
            </template>
          </v-data-table>
        </template>
      </v-card>
    
      <!-- Dialog Add -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} Jadwal Umum</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-select :items="instrukturs" v-model="form.id_instruktur" label="Pilih Instruktur" item-value="id_instruktur" :rules="error.id_instruktur" item-text="nama_instruktur"></v-select>
                <v-select :items="kelass" v-model="form.id_kelas" label="Pilih Kelas" item-value="id_kelas" :rules="error.id_kelas" item-text="nama_kelas"></v-select>
                <v-text-field v-model="form.tanggal" label="Tanggal" required type="date" :rules="error.tanggal"></v-text-field>
                <v-text-field v-model="form.hari" label="Hari" required :rules="error.hari"></v-text-field>
                <v-text-field v-model="form.jam" label="Jam" required :rules="error.jam"></v-text-field>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancel()">Cancel</v-btn>            
              <v-btn color="blue darken-1" text @click="dialogConfirmEdit = true">Save</v-btn>            
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
        
      <!-- Dialog confirmEdit -->
      <v-row justify="center">
        <v-dialog v-model="dialogConfirmEdit" persistent max-width="400">
          <v-card>
          <v-card-title class="text-h5"
            >Are you sure to {{ formTitle }} this data?</v-card-title
            >
            <v-card-text> Tindakan ini akan mengedit data anda! </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="cancel">No</v-btn>
              <v-btn color="green darken-1" text @click="setForm">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
        
        <!-- Dialog Confirm for delete -->
      <v-row justify="center">
        <v-dialog v-model="dialogConfirm" max-width="400">
          <v-card>
            <v-card-title class="text-h5"
            >Are you sure to delete this data?</v-card-title
            >
            <v-card-text> Tindakan ini akan menghapus data anda! </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialogConfirm = false">No</v-btn>
              <v-btn color="green darken-1" text @click="deleteData">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      
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
                  <v-text-subtitle>Kelas : {{ selectedKelas.nama_kelas }}</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Tanggal : {{ form.tanggal }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Hari : {{ form.hari }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Jam : {{ form.jam }}</v-text-subtitle>    
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

      instrukturs: [],
      kelass: [],
      jadwalUmums: [],
      jadwalUmum: new FormData(),

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {
        id_instruktur: "",
        id_kelas: "",
        tanggal: "",
        hari: "",
        jam: "",
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
        { text: "Hari", value: "hari" },
        { text: "Jam", value: "jam" },
        { text: "Kelas", value: "kelas_foreign_key.nama_kelas"},
        { text: "Instruktur", value: "instruktur_foreign_key.nama_instruktur"},
        // { text: "Tanggal", value: "tanggal" },
        { text: "Slot Kelas", value: "slot_kelas" },
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
    selectedKelas() {
      // Menggunakan computed property untuk mengambil data kelas yang dipilih berdasarkan ID
      return this.kelass.find((kelas) => kelas.id_kelas === this.form.id_kelas) || {};
    },
    combinedItems() {
      return this.jadwalUmums.concat(this.instrukturs, this.kelass);
    },
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataInstruktur();
    this.getDataKelas();
    this.getDataJadwalUmum();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Add") {
        this.updateJadwalUmum();
      } else {                
        this.saveJadwalUmum();
      }
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
    getDataKelas() {
      this.load = true;
      var url = this.$api + "/kelas";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.kelass = response.data.data;
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

    saveJadwalUmum() {      
      console.log(this.form.tanggal);

      let newData = {
        id_instruktur: this.form.id_instruktur,
        id_kelas: this.form.id_kelas,
        tanggal: this.form.tanggal,
        hari: this.form.hari,
        jam: this.form.jam,
      };

      var url = this.$api + "/jadwalUmum";
      this.load = true;
      this.$http
        .post(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Add Data Success";
          this.color = "black";
          this.snackbar = true;
          this.load = true;
          this.close();
          this.getDataJadwalUmum();
          this.resetForm();
        })
        .catch(() => {
          this.error_message = "Check Your Data Again";
          this.color = "black";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },

    updateJadwalUmum() {
      let newData = {
        id_instruktur: this.form.id_instruktur,
        id_kelas: this.form.id_kelas,
        tanggal: this.form.tanggal,
        hari: this.form.hari,
        jam: this.form.jam,
      };

      var url = this.$api + "/jadwalUmum/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Update Data Success";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.getDataJadwalUmum();
          this.resetForm();
          this.inputType = "Add";
        })
        .catch(() => {
          this.error_message = "Check Your Data Again";
          this.color = "black";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    
    deleteData() {
      var url = this.$api + "/jadwalUmum/" + this.deleteId;
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
          this.getDataJadwalUmum();
          this.resetForm();
          location.reload();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
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
        this.resetForm();
      this.getDataJadwalUmum();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataJadwalUmum();
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;
      this.resetForm();
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
    getHandler(item) {
      this.editId = item.id_jadwal_umum;
      this.form.id_instruktur = item.id_instruktur;
      this.form.id_kelas = item.id_kelas;
      this.form.tanggal = item.tanggal;
      this.form.hari = item.hari;
      this.form.jam = item.jam;
      this.dialogShowDetails = true;
    },
    resetForm() {
      this.form = {
        id_instruktur: "",
        id_kelas: "",
        tanggal: "",
        hari: "",
        jam: "",
      };
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