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
          <v-data-table :headers="headers" :items="presensiBookingGyms" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">                
                <v-icon class="mr-2" @click="presensiHandler(item.id_booking_gym)">{{ icons.mdiAlarmCheck }}</v-icon>
                <v-icon class="mr-2" @click="generatePDF(item)">{{ icons.mdiPrinter }}</v-icon>
            </template>
          </v-data-table>
        </template>
      </v-card>
    
      <!-- Dialog Add -->
      <!-- <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} Transaksi Aktivasi</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-select :items="members" v-model="form.id_member" label="Pilih Member Yang Akan Diaktivasi" item-value="id_member" :rules="error.id_member" item-text="nama_member"></v-select>                 
                <v-text-field v-model="form.jumlah_pembayaran_aktivasi" label="Jumlah Pembayaran" required type="number" :rules="error.jumlah_pembayaran_aktivasi"></v-text-field>                
                <v-select :items="jenisPembayaran" v-model="form.jenis_pembayaran_aktivasi" label="Jenis Pembayaran" item-value="value" :rules="error.jenis_pembayaran_aktivasi" item-text="text"></v-select>                                             
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
      </v-row> -->
        
      <!-- Dialog confirmEdit -->
      <!-- <v-row justify="center">
        <v-dialog v-model="dialogConfirmEdit" persistent max-width="400">
          <v-card>
          <v-card-title class="text-h5"
            >Are you sure to {{ formTitle }} this data?</v-card-title
            >
            <v-card-text> Tindakan ini akan mengedit data anda! </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="cancel">No</v-btn>
              <v-btn color="green darken-1" text @click="saveTransaksiAktivasi">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row> -->

      <!-- Dialog confirm Presensi -->
      <v-row justify="center">
        <v-dialog v-model="dialogConfirmPresensi" persistent max-width="400">
          <v-card>
            <v-card-title class="text-h5">Presensi this member?</v-card-title>            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="close">No</v-btn>
              <v-btn color="green darken-1" text @click="updatePresensiBookingGym">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
        
        <!-- Dialog Confirm for delete -->
      <!-- <v-row justify="center">
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
      </v-row> -->
      
      <!-- Dialog Show Details -->
      <!-- <v-row justify="center">
        <v-dialog v-model="dialogShowDetails" max-width="400px" persistent>
          <v-card>
            <v-card-title class="background-color">
              <span class="headline text-center text-color">Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div>                                    
                  <v-text-subtitle>No Struk : {{ form.id_aktivasi }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Tanggal : {{ form.tanggal_aktivasi }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Kasir : {{ form.id_pegawai }} / {{ selectedPegawai.nama_pegawai }}</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Member : {{ form.id_member }} / {{ selectedMember.nama_member }}</v-text-subtitle>                                                    
                  <br>                         
                  <v-text-subtitle>Aktivasi Tahunan : {{ form.jumlah_pembayaran_aktivasi }}</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Masa Aktif Member : {{ form.tanggal_kadaluarsa }}</v-text-subtitle>                                                    
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
      </v-row> -->
    
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
import { mdiPlus, mdiPencil, mdiDelete, mdiEye, mdiPrinter, mdiAlarmCheck } from "@mdi/js";
import { jsPDF } from "jspdf";
// import "jspdf-autotable";

export default {
  data() {
    return {
      icons: {
        mdiPlus,
        mdiPencil,
        mdiDelete,
        mdiEye,
        mdiPrinter,
        mdiAlarmCheck,
      },
      deleteId: "",
      presensiBookingGymId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,

      members: [],
      presensiBookingGyms: [],      
      presensiBookingGym: new FormData(),

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogConfirmPresensi: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {
        id_booking_gym: "",  
        id_member: "",                                     
        tanggal_booking: "",
        tanggal_yang_dibooking: "",
        slot_waktu: "",
        waktu_presensi: "",        
        member_foreign_key: {
          id_member: "",
          nama_member: "",
        },                  
      },
      error: {
        id_member: [(v) => !!v || "Nama Member is required"],
        jumlah_pembayaran_aktivasi: [
            (v) => !!v || "Jumlah Pembayaran is required",
            (v) => v >= 3000000 || "Jumlah Pembayaran must be at least 3000000",
        ],
        jenis_pembayaran_aktivasi: [(v) => !!v || "Jenis Pembayaran is required"],
      },
      items: [
        { text: "...", disabled: true },
        { text: "Presensi Booking Gym", disabled: false },
      ],
      headers: [
        { text: "No Struk", value: "id_booking_gym"},        
        { text: "Nama Member", value: "member_foreign_key.nama_member"},                
        { text: "Tanggal Booking", value: "tanggal_booking" },        
        { text: "Tanggal Yang Dibooking", value: "tanggal_yang_dibooking" },        
        { text: "Slot Waktu", value: "slot_waktu" },
        { text: "Waktu Presensi", value: "waktu_presensi" },
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
    selectedMember() {
      // Menggunakan computed property untuk mengambil data member yang dipilih berdasarkan ID
      return this.members.find((member) => member.id_member === this.form.id_member) || {};
    },
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataMember();    
    this.getDataPresensiBookingGym();
  },
  methods: {
    getIdPegawai() {
      return localStorage.getItem("id_pegawai");
    },

    getNamaPegawai() {      
      return localStorage.getItem("nama_pegawai");      
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

    getDataPresensiBookingGym() {
      this.load = true;
      var url = this.$api + "/presensiBookingGym";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.presensiBookingGyms = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    // saveTransaksiAktivasi() {            
    //   let newData = {
    //     id_pegawai: this.getIdPegawai(),
    //     id_member: this.form.id_member,         
    //     jumlah_pembayaran_aktivasi: this.form.jumlah_pembayaran_aktivasi,
    //     jenis_pembayaran_aktivasi: this.form.jenis_pembayaran_aktivasi,        
    //   };

    //   var url = this.$api + "/transaksiAktivasi";
    //   this.load = true;
    //   this.$http
    //     .post(url, newData, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     })
    //     .then(() => {
    //       this.error_message = "Add Data Success";
    //       this.color = "black";
    //       this.snackbar = true;
    //       this.load = true;
    //       this.close();
    //       this.getDataTransaksiAktivasi();
    //       this.resetForm();
    //     })
    //     .catch(() => {
    //       this.error_message = "Check Your Data Again";
    //       this.color = "black";
    //       this.dialogConfirmEdit = false;
    //       this.snackbar = true;
    //       this.load = false;
    //     });
    // },
    
    updatePresensiBookingGym() {
        var url = this.$api + "/presensiBookingGym/" + this.presensiBookingGymId;
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
          this.getDataPresensiBookingGym();          
        })
        .catch((error) => {                 
          this.error_message = error.response.data.message;
          this.color = "black";
          this.snackbar = true;
          this.load = false;
        });
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.dialogConfirmPresensi = false;    
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;
      this.resetForm();
    },
    presensiHandler(id_booking_gym) {
      this.presensiBookingGymId = id_booking_gym;
      this.dialogConfirmPresensi = true;
    },
    // getHandler(item) {
    //   this.editId = item.id_aktivasi;
    //   this.form.id_aktivasi = item.id_aktivasi;
    //   this.form.id_pegawai = item.id_pegawai;
    //   this.form.id_member = item.id_member;
    //   this.form.jumlah_pembayaran_aktivasi = item.jumlah_pembayaran_aktivasi;
    //   this.form.jenis_pembayaran_aktivasi = item.jenis_pembayaran_aktivasi;
    //   this.form.tanggal_aktivasi = item.tanggal_aktivasi;
    //   this.form.tanggal_kadaluarsa = item.tanggal_kadaluarsa;
    //   this.dialogShowDetails = true;
    // },
    resetForm() {
      this.form = {
        id_member: "",
        jumlah_pembayaran_aktivasi: "",
        jenis_pembayaran_aktivasi: "",        
      };
    },

    generatePDF(item) {                 
        const doc = new jsPDF();

        doc.text("Gofit", 10, 10);
        doc.text("Jl. Centralpark No. 10 Yogyakarta", 10, 20);

        doc.text("STRUK PRESENSI GYM", 10, 40);
        doc.text(`No Struk: ${item.id_booking_gym}`, 10, 50);
        doc.text(`Tanggal: ${item.waktu_presensi}`, 10, 60);
        
        doc.text(`Member: ${item.id_member} / ${item.member_foreign_key.nama_member}`, 10, 80);
        doc.text(`Slot Waktu: ${item.slot_waktu}`, 10, 90);
        
        doc.save("struk_presensi_booking_gym.pdf");
    }
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