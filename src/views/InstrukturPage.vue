<template>
  <v-main class="pegawaiBackground">
    <div class="content-style">

      <v-card>
        <div class="d-flex">
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <div class="ml-auto mr-3 mt-3">
            <v-btn class="ma-2" outlined fab color="indigo" @click="dialog = true"><v-icon>{{ icons.mdiPlus }}</v-icon></v-btn>
          </div>
        </div>
        <v-data-table :headers="headers" :items="instrukturs" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">        
          <template v-slot:[`item.actions`]="{ item }">          
            <v-icon class="mr-2" @click="editHandler(item)">{{ icons.mdiPencil }}</v-icon>
            <v-icon class="mr-2" @click="deleteHandler(item.id_instruktur)">{{ icons.mdiDelete }}</v-icon>          
          </template>
        </v-data-table>
      </v-card>
  
      <!-- Dialog Add -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} Instruktur</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field v-model="form.nama_instruktur" label="Nama" required :rules="error.nama_instruktur"></v-text-field>
                <v-text-field v-model="form.alamat_instruktur" label="Alamat" required :rules="error.alamat_instruktur"></v-text-field>
                <v-text-field v-model="form.tanggal_lahir_instruktur" label="Tanggal Lahir" required type="date" :rules="error.tanggal_lahir_instruktur"></v-text-field>
                <v-text-field v-model="form.no_telepon_instruktur" label="No Telepon" required :rules="error.no_telepon_instruktur"></v-text-field>            
                <v-text-field v-model="form.gaji_instruktur" label="Gaji" type="number" required :rules="error.gaji_instruktur"></v-text-field>                          
                <v-text-field v-model="form.email" label="Email" require :rules="error.email"></v-text-field>
                <v-text-field v-model="form.password" label="Password" type="password" require :rules="error.password"></v-text-field>
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
            <v-card-title class="text-h5">Are you sure to {{ formTitle }} this data?</v-card-title>
            <v-card-text>
              Tindakan ini akan mengedit data anda!
            </v-card-text>
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
            <v-card-title class="text-h5">Are you sure to delete this data?</v-card-title>
            <v-card-text>
              Tindakan ini akan menghapus data anda!
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialogConfirm = false" >No</v-btn>
              <v-btn color="green darken-1" text @click="deleteData">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
  
    <!-- Dialog Load -->
      <!-- <div class="text-center">
        <v-btn :disabled="dialogLoading" :loading="dialogLoading" class="white--text" color="purple darken-2" @click="dialogLoading = true">Start loading</v-btn>
        <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div> -->
  
  
      <v-snackbar v-model="snackbar" :color="color" bottom
        >{{ error_message }}
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
import {
  mdiPlus,
  mdiPencil,
  mdiDelete,  
} from '@mdi/js'

  
export default {
  data() {    
    return {
      icons: {
        mdiPlus,
        mdiPencil,
        mdiDelete,        
      },
      deleteId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,

      instrukturs: [],
      instruktur: new FormData(),
      
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      form: {
        nama_instrukturr: "",
        alamat_instruktur: "",
        tanggal_lahir_instruktur: "",
        no_telepon_instruktur: "",
        gaji_instruktur: "",
        email: "",
        password: "",
      },
      error: {
        nama_instruktur: [v => !!v || "Nama is required"],
        alamat_instruktur: [v => !!v || "Alamat is required"],
        tanggal_lahir_instruktur: [v => !!v || "Tanggal Lahir is required"],
        no_telepon_instruktur: [v => !!v || "No Telepon is required"],
        gaji_instruktur: [v => !!v || "Gaji is required"],
        email: [v => !!v || "Gaji is required"],
        password: [v => !!v || "Gaji is required"],
      },
      items: [
        {text: "...",disabled: true,},
        {text: "Instruktur",disabled: false,},
      ],
      headers: [        
        {text: "Nama", value: "nama_instruktur"},
        {text: "Alamat", value: "alamat_instruktur"},
        {text: "Tanggal Lahir", value: "tanggal_lahir_instruktur"},
        {text: "No Telepon", value: "no_telepon_instruktur"},
        {text: "Gaji", value: "gaji_instruktur"},
        {text: "Email", value: "email"},
        {text: "Actions", value: "actions",},
      ],
    };
  },
  watch: {
    dialogLoading (val) {
      if (!val) return

      setTimeout(() => (this.dialogLoading = false), 1000)
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataInstruktur();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Add") {
        this.updateInstruktur();
      } else {
        this.saveInstruktur();
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
    saveInstruktur() {
      this.instruktur.append("nama_instruktur", this.form.nama_instruktur);
      this.instruktur.append("alamat_instruktur", this.form.alamat_instruktur);
      this.instruktur.append("tanggal_lahir_instruktur", this.form.tanggal_lahir_instruktur);
      this.instruktur.append("no_telepon_instruktur", this.form.no_telepon_instruktur);
      this.instruktur.append("gaji_instruktur", this.form.gaji_instruktur);
      this.instruktur.append("email", this.form.email);
      this.instruktur.append("password", this.form.password);
      var url = this.$api + "/instruktur";
      this.load = true;
      this.$http
        .post(url, this.instruktur, {
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
          this.getDataInstruktur();
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
    updateInstruktur() {
      let newData = {
        nama_instruktur: this.form.nama_instruktur,
        alamat_instruktur: this.form.alamat_instruktur,
        tanggal_lahir_instruktur: this.form.tanggal_lahir_instruktur,
        no_telepon_instruktur: this.form.no_telepon_instruktur,
        gaji_instruktur: this.form.gaji_instruktur,
        email: this.form.email,
        password: this.form.password,
      };
      var url = this.$api + "/instruktur/" + this.editId;
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
          this.getDataInstruktur();
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
      var url = this.$api + "/instruktur/" + this.deleteId;
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
          this.getDataInstruktur();
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
        nama_instruktur: false,
        alamat_instruktur: false,
        tanggal_lahir_instruktur: false,
        no_telepon_instruktur: false,
        gaji_instruktur: false,
        email: false,
        password: false,    
      }),
        this.resetForm();
      this.getDataInstruktur();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;      
      this.getDataInstruktur();
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_instruktur;
      this.form.nama_instruktur = item.nama_instruktur;
      this.form.alamat_instruktur = item.alamat_instruktur;
      this.form.tanggal_lahir_instruktur = item.tanggal_lahir_instruktur;
      this.form.no_telepon_instruktur = item.no_telepon_instruktur;
      this.form.gaji_instruktur = item.gaji_instruktur;
      this.form.email = item.email;
      this.form.password = item.password;
      this.dialog = true;
    },
    deleteHandler(id_instruktur) {
      this.deleteId = id_instruktur;
      this.dialogConfirm = true;
    },
    resetForm() {
      this.form = {
        nama_instruktur: "",
        alamat_instruktur: "",
        tanggal_lahir_instruktur: "",
        no_telepon_instruktur: "",
        gaji_instruktur: "",        
        email: "",
        password: "",
      };
    },
  },
};
</script>

<style>
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

/* @media screen {
  .v-data-table > .v-data-table__wrapper > table > tbody > tr:nth-child(odd) {
    border-left: 6px solid #1428de;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr:nth-child(even) {
    border-left: 6px solid #ffffff;
  }
} */
</style>
