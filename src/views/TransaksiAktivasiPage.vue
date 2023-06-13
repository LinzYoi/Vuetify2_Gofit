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
          <v-data-table :headers="headers" :items="transaksiAktivasis" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mr-2" @click="deleteHandler(item.id_aktivasi)">{{ icons.mdiDelete }}</v-icon>
                <v-icon class="mr-2" @click="getHandler(item)">{{ icons.mdiEye }}</v-icon>
                <v-icon class="mr-2" @click="generatePDF(item)">{{ icons.mdiPrinter }}</v-icon>
            </template>
          </v-data-table>
        </template>
      </v-card>
    
      <!-- Dialog Add -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} Transaksi Aktivasi</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-select :items="members" v-model="form.id_member" label="Pilih Member Yang Akan Diaktivasi" item-value="id_member" :rules="error.id_member" item-text="nama_member"></v-select> 
                <!-- <v-select :items="pegawais" v-model="form.id_pegawai" label="Pilih Pegawai" item-value="id_pegawai" :rules="error.id_member" item-text="nama_pegawai"></v-select>  -->
                <!-- <v-text-field v-model="form.jumlah_pembayaran_aktivasi" label="Jumlah Pembayaran" required type="number" :rules="error.jumlah_pembayaran_aktivasi"></v-text-field>                 -->
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
              <v-btn color="green darken-1" text @click="saveTransaksiAktivasi">Yes</v-btn>
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
                  <v-text-subtitle>No Struk : {{ form.id_aktivasi }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Tanggal : {{ form.tanggal_aktivasi }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Kasir : {{ form.id_pegawai }} / {{ selectedPegawai.nama_pegawai }}</v-text-subtitle>                                                    
                  <br>       
                
                  <!-- from this -->
                  <!-- <v-select disabled :items="members" v-model="form.id_member" label="Nama Member" item-value="id_member" item-text="nama_member"></v-select>                                     -->
                  <!-- to this  -->
                  <v-text-subtitle>Member : {{ form.id_member }} / {{ selectedMember.nama_member }}</v-text-subtitle>                                                    
                  <br>       
                  <!-- chat gpt kelazzz -->

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
import { mdiPlus, mdiPencil, mdiDelete, mdiEye, mdiPrinter } from "@mdi/js";
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
        mdiPrinter        
      },
      deleteId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,

      members: [],
      pegawais: [],
      transaksiAktivasis: [],
      transaksiAktivasi: new FormData(),

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {
        id_member: "",  
        id_pegawai: "",                             
        jumlah_pembayaran_aktivasi: "",
        jenis_pembayaran_aktivasi: "",      
        pegawai_foreign_key: {
          id_pegawai: "",
          nama_pegawai: "",
        },          
        member_foreign_key: {
          id_member: "",
          nama_member: "",
        },          
      },
      error: {
        id_member: [(v) => !!v || "Nama Member is required"],
        // jumlah_pembayaran_aktivasi: [
        //     (v) => !!v || "Jumlah Pembayaran is required",
        //     (v) => v >= 3000000 || "Jumlah Pembayaran must be at least 3000000",
        // ],
        jenis_pembayaran_aktivasi: [(v) => !!v || "Jenis Pembayaran is required"],
      },
      jenisPembayaran: [                
        { text: "Cash", value: "Cash"},        
        { text: "Debit", value: "Debit"},        
        { text: "Transfer", value: "Transfer"},
      ],
      items: [
        { text: "...", disabled: true },
        { text: "Transaksi Aktivasi", disabled: false },
      ],
      headers: [
        { text: "No Struk", value: "id_aktivasi"},        
        { text: "ID Member", value: "id_member"},                
        { text: "Aktivasi Tahunan", value: "jumlah_pembayaran_aktivasi"},
        { text: "Tanggal", value: "tanggal_aktivasi"},
        { text: "Masa Aktif Member", value: "tanggal_kadaluarsa"},
        { text: "Jenis Pembayaran", value: "jenis_pembayaran_aktivasi"},        
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
    selectedPegawai() {
        return this.pegawais.find((pegawai) => pegawai.id_pegawai === this.form.id_pegawai) || {};
    },
    combinedItems() {
      return this.transaksiAktivasis.concat(this.members, this.pegawais);
    },
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataMember();
    this.getDataPegawai();
    this.getDataTransaksiAktivasi();
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

    getDataPegawai() {
      this.load = true;
      var url = this.$api + "/pegawai";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pegawais = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    getDataTransaksiAktivasi() {
      this.load = true;
      var url = this.$api + "/transaksiAktivasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {          
          this.transaksiAktivasis = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    saveTransaksiAktivasi() {            
      let newData = {
        id_pegawai: this.getIdPegawai(),
        id_member: this.form.id_member,         
        jumlah_pembayaran_aktivasi: this.form.jumlah_pembayaran_aktivasi,
        jenis_pembayaran_aktivasi: this.form.jenis_pembayaran_aktivasi,        
      };

      var url = this.$api + "/transaksiAktivasi";
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
          this.getDataTransaksiAktivasi();
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "black";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    
    deleteData() {
      var url = this.$api + "/transaksiAktivasi/" + this.deleteId;
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
          this.getDataTransaksiAktivasi();
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
      this.getDataTransaksiAktivasi();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataTransaksiAktivasi();
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;
      this.resetForm();
    },
    // editHandler(item) {
    //   this.inputType = "Update";
    //   this.editId = item.id_jadwal_umum;
    //   this.form.id_instruktur = item.id_instruktur;
    //   this.form.id_kelas = item.id_kelas;
    //   this.form.tanggal = item.tanggal;
    //   this.form.hari = item.hari;
    //   this.form.jam = item.jam;
    //   this.dialog = true;
    // },
    deleteHandler(id_aktivasi) {
      this.deleteId = id_aktivasi;
      this.dialogConfirm = true;
    },
    getHandler(item) {
      this.editId = item.id_aktivasi;
      this.form.id_aktivasi = item.id_aktivasi;
      this.form.id_pegawai = item.id_pegawai;
      this.form.id_member = item.id_member;
      this.form.jumlah_pembayaran_aktivasi = item.jumlah_pembayaran_aktivasi;
      this.form.jenis_pembayaran_aktivasi = item.jenis_pembayaran_aktivasi;
      this.form.tanggal_aktivasi = item.tanggal_aktivasi;
      this.form.tanggal_kadaluarsa = item.tanggal_kadaluarsa;
      this.dialogShowDetails = true;
    },
    resetForm() {
      this.form = {
        id_member: "",
        jumlah_pembayaran_aktivasi: "",
        jenis_pembayaran_aktivasi: "",        
      };
    },

    generatePDF(item) {         
        this.editId = item.id_aktivasi;
        this.form.id_aktivasi = item.id_aktivasi;
        this.form.id_pegawai = item.id_pegawai;
        this.form.id_member = item.id_member;
        this.form.jumlah_pembayaran_aktivasi = item.jumlah_pembayaran_aktivasi;
        this.form.jenis_pembayaran_aktivasi = item.jenis_pembayaran_aktivasi;
        this.form.tanggal_aktivasi = item.tanggal_aktivasi;
        this.form.tanggal_kadaluarsa = item.tanggal_kadaluarsa;     

        const doc = new jsPDF();

// Header
doc.setFontSize(20);
doc.text("GOFIT", 80, 15, "center");

// Alamat
doc.setFontSize(10);
doc.text("Jl. Centralpark No. 10 Yogyakarta", 80, 25, "center");

// Judul Struk
doc.setFontSize(18);
doc.text("Struk Pembayaran Aktivasi", 80, 40, "center");

// Informasi Transaksi
doc.setFontSize(12);
doc.text(`No Struk: ${item.id_aktivasi}`, 20, 60);
doc.text(`Tanggal: ${item.tanggal_aktivasi}`, 20, 70);
doc.text(`Kasir: ${item.id_pegawai} / ${item.pegawai_foreign_key.nama_pegawai}`, 20, 80);
doc.text(`Member: ${item.id_member} / ${this.selectedMember.nama_member}`, 20, 90);
doc.text(`Aktivasi Tahunan: ${item.jumlah_pembayaran_aktivasi}`, 20, 100);
doc.text(`Masa aktif member: ${item.tanggal_kadaluarsa}`, 20, 110);

// Garis pemisah
doc.setLineWidth(0.5);
doc.line(20, 115, 190, 115);

// Footer
doc.setFontSize(8);
doc.text("Terima kasih atas kunjungan Anda!", 80, 130, "center");

doc.save("struk_transaksi_aktivasi.pdf");

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