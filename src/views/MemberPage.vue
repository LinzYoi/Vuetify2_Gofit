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
        <v-data-table :headers="headers" :items="members" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data" style="width: max-content;">        
          <template v-slot:[`item.actions`]="{ item }">          
            <v-icon class="mr-2" @click="editHandler(item)">{{ icons.mdiPencil }}</v-icon>
            <v-icon class="mr-2" @click="deleteHandler(item.id_member)">{{ icons.mdiDelete }}</v-icon>
            <v-icon class="mr-2" @click="resetPassword(item)">{{ icons.mdiLockReset }}</v-icon>
            <v-icon class="mr-2" @click="deactiveHandler(item.id_member)">{{ icons.mdiAccountOff }}</v-icon>
          </template>
        </v-data-table>
      </v-card>
  
      <!-- Dialog Add -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} Member</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field v-model="form.nama_member" label="Nama Member" required :rules="error.nama_member"></v-text-field>
                <v-text-field v-model="form.alamat_member" label="Alamat" required :rules="error.alamat_member"></v-text-field>
                <v-text-field v-model="form.tanggal_lahir_member" label="Tanggal Lahir" required type="date" :rules="error.tanggal_lahir_member"></v-text-field>
                <v-text-field v-model="form.no_telepon_member" label="No Telepon" required :rules="error.no_telepon_member"></v-text-field>                
                <v-select :items="jenisKelamin" v-model="form.jenis_kelamin_member" label="Jenis Kelamin" item-value="value" :rules="error.jenis_kelamin_member" item-text="text"></v-select>                                
                <v-text-field v-model="form.email" label="Email" require :rules="error.email"></v-text-field>
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

      <!-- Dialog Deaktivasi  -->
      <v-row justify="center">      
        <v-dialog v-model="dialogConfirmDeactiveMember" max-width="500">
          <v-card>
            <v-card-title class="text-h5">Are you sure to deactive this member?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialogConfirmDeactiveMember = false" >No</v-btn>
              <v-btn color="green darken-1" text @click="deactiveMember">Yes</v-btn>
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
  mdiLockReset,
  mdiAccountOff,
} from '@mdi/js'

  
export default {
  data() {    
    return {
      icons: {
        mdiPlus,
        mdiPencil,
        mdiDelete,
        mdiAccountOff,
        mdiLockReset,
      },
      deleteId: "",
      deactiveId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,
      members: [],
      member: new FormData(),
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmDeactiveMember: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      form: {
        nama_member: "",
        alamat_member: "",
        tanggal_lahir_member: "",
        no_telepon_member: "",
        jenis_kelamin_member: "",                        
        email: "",        
      },
      error: {
        nama_member: [(v) => !!v || "Nama harus diisi"],
        alamat_member: [(v) => !!v || "Alamat harus diisi"],
        tanggal_lahir_member: [(v) => !!v || "Tanggal lahir harus diisi"],
        no_telepon_member: [(v) => !!v || "Nomor telepon harus diisi"],
        jenis_kelamin_member: [(v) => !!v || "Jenis kelamin harus diisi"],                
        email: [(v) => !!v || "Email harus diisi"],               
      },
      jenisKelamin: [
        {text: "Pria", value: "Pria",},
        {text: "Wanita", value: "Wanita",},
      ],
      statusAktif: [
        {text: "Aktif", value: "Aktif",},
        {text: "Tidak Aktif", value: "Tidak Aktif",},
      ],
      items: [
        {text: "...",disabled: true,},
        {text: "Member",disabled: false,},
      ],
      headers: [
        {text: "ID Member", value: "id_member",},
        {text: "Nama", value: "nama_member",},        
        {text: "Tanggal Lahir", value: "tanggal_lahir_member"},
        {text: "Nomor Telepon", value: "no_telepon_member",},
        {text: "Jenis Kelamin", value: "jenis_kelamin_member",},
        {text: "Status", value: "status_member",},
        {text: "Deposit Uang", value: "sisa_deposit_uang_member",},        
        {text: "Masa Berlaku", value: "masa_berlaku_member"},
        {text: "Email", value: "email",},
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
    this.getDataMember();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Add") {        
        this.updateMember();
      } else {
        this.saveMember();
      }
    },
    getDataMember() {
      this.load = true;
      var url = this.$api + "/member";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.members = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    saveMember() {
      this.member.append("nama_member", this.form.nama_member);
      this.member.append("alamat_member", this.form.alamat_member);
      this.member.append("tanggal_lahir_member", this.form.tanggal_lahir_member);
      this.member.append("no_telepon_member", this.form.no_telepon_member);
      this.member.append("jenis_kelamin_member", this.form.jenis_kelamin_member);            
      this.member.append("email", this.form.email);

      var url = this.$api + "/member";
      this.load = true;
      this.$http
        .post(url, this.member, {
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
          this.getDataMember();
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
    updateMember() {
      let newData = {
        nama_member: this.form.nama_member,
        alamat_member: this.form.alamat_member,
        tanggal_lahir_member: this.form.tanggal_lahir_member,
        no_telepon_member: this.form.no_telepon_member,
        jenis_kelamin_member: this.form.jenis_kelamin_member,                
        email: this.form.email,
      };
      var url = this.$api + "/member/" + this.editId;
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
          this.getDataMember();
          this.resetForm();
          this.inputType = "Add";
        })
        .catch(() => {
          this.error_message = "Update Data Failed!";
          this.color = "black";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/member/" + this.deleteId;
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
          this.getDataMember();
          this.resetForm();
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
    deactiveMember() {
      var url = this.$api + "/memberDeactive/" + this.deactiveId;
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
          this.getDataMember();          
          location.reload();          
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
        nama_member: false,
        alamat_member: false,
        tanggal_lahir_member: false,
        no_telepon_member: false,
        jenis_kelamin_member: false,                
        email: false,        
      }),
        this.resetForm();
      this.getDataMember();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false; 
      this.dialogConfirmDeactive = false;     
      this.getDataMember();
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_member;
      this.form.nama_member = item.nama_member;
      this.form.alamat_member = item.alamat_member;
      this.form.tanggal_lahir_member = item.tanggal_lahir_member;
      this.form.no_telepon_member = item.no_telepon_member;
      this.form.jenis_kelamin_member = item.jenis_kelamin_member;            
      this.form.email = item.email;
      this.dialog = true;
    },
    resetPassword(item) {
      let newData = {
        nama_member: item.nama_member,
        alamat_member: item.alamat_member,
        tanggal_lahir_member: item.tanggal_lahir_member,
        no_telepon_member: item.no_telepon_member,
        jenis_kelamin_member: item.jenis_kelamin_member,                
        email: item.email,
        password: item.tanggal_lahir_member,
      };
      var url = this.$api + "/member/" + item.id_member;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Reset Password Success";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.getDataMember();
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
    deleteHandler(id_member) {
      this.deleteId = id_member;
      this.dialogConfirm = true;
    },
    deactiveHandler(id_member) {
      this.deactiveId = id_member;
      this.dialogConfirmDeactiveMember = true;
    },
    resetForm() {
      this.form = {
        nama_member: "",
        alamat_member: "",
        tanggal_lahir_member: "",
        no_telepon_member: "",
        jenis_kelamin_member: "",                
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
    border-left: 6px solid #ff0909;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr:nth-child(even) {
    border-left: 6px solid #ffffff;
  }
} */
</style>
