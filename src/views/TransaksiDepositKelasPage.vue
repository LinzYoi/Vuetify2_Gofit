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
          <v-data-table :headers="headers" :items="transaksiDepositKelass" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mr-2" @click="deleteHandler(item.id_deposit_kelas)">{{ icons.mdiDelete }}</v-icon>
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
              <span class="headline">{{ formTitle }} Transaksi Deposit Kelas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-select :items="members" v-model="form.id_member" label="Pilih Member Yang Mau Deposit Kelas" item-value="id_member" :rules="error.id_member" item-text="nama_member"></v-select> 
                <v-select :items="kelass" v-model="form.id_kelas" label="Pilih Kelas" item-value="id_kelas" :rules="error.id_kelas" item-text="nama_kelas"></v-select>                                                                             
                <v-select :items="jumlahDepositKelas" v-model="form.jumlah_deposit_kelas" label="Jumlah Deposit Kelas" required item-value="value" :rules="error.jumlah_deposit_kelas" item-text="text"></v-select>                
                <!-- <v-text-field v-model="form.jumlah_pembayaran_deposit_kelas" label="Jumlah Pembayaran" required type="number" :rules="error.jumlah_pembayaran_deposit_kelas"></v-text-field>                 -->
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
              <v-btn color="green darken-1" text @click="saveTransaksiDepositKelas">Yes</v-btn>
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
                  <v-text-subtitle>No Struk : {{ form.id_deposit_kelas }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Tanggal : {{ form.tanggal_deposit_kelas }}</v-text-subtitle>    
                  <br>                                                
                  <v-text-subtitle>Kasir : {{ form.id_pegawai }} / {{ selectedPegawai.nama_pegawai }}</v-text-subtitle>                                                    
                  <br>       
                
                  <v-text-subtitle>Member : {{ form.id_member }} / {{ selectedMember.nama_member }}</v-text-subtitle>                                                    
                  <br>                         
                  <v-text-subtitle>Deposit (bayar {{ form.jumlah_deposit_kelas }} gratis {{ form.bonus_deposit_kelas }}) : Rp.{{ form.jumlah_pembayaran_deposit_kelas }},- ({{ form.jumlah_deposit_kelas }} x Rp.{{ selectedKelas.harga_kelas }})</v-text-subtitle>                                                    
                  <br>       
                  <v-text-subtitle>Jenis Kelas : {{ selectedKelas.nama_kelas }}</v-text-subtitle>
                  <br>       
                  <v-text-subtitle>Total Deposit {{ selectedKelas.nama_kelas }} : {{ form.total_deposit_kelas }}</v-text-subtitle>
                  <br>       
                  <v-text-subtitle>Berlaku sampai dengan : {{ form.tanggal_kadaluarsa_deposit_kelas }}</v-text-subtitle>
                  <br>                                                                                                   
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogShowDetails">Close</v-btn>
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

      pegawais: [],
      members: [],
      kelass: [],      
      transaksiDepositKelass: [],
      transaksiDepositKelas: new FormData(),

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,
      form: {
        id_pegawai: "",                             
        id_member: "",  
        id_kelas: "",          
        tanggal_deposit_kelas: "",
        jumlah_pembayaran_deposit_kelas: "",   
        jumlah_deposit_kelas: "",            
        bonus_deposit_kelas: "",       
        total_deposit_kelas: "",
        tanggal_kadaluarsa_deposit_kelas: "",
        pegawai_foreign_key: {
          nama_pegawai: "",
        },
      },
      error: {
        id_member: [(v) => !!v || "Nama Member is required"],
        id_kelas: [(v) => !!v || "Nama Kelas is required"],        
        jumlah_pembayaran_deposit_kelas: [
            (v) => !!v || "Jumlah Pembayaran is required",            
        ],        
      },
      jumlahDepositKelas: [
        {text: "5", value: "5",},
        {text: "10", value: "10",},
      ],
      items: [
        { text: "...", disabled: true },
        { text: "Transaksi Deposit Kelas", disabled: false },
      ],
      headers: [
        { text: "No Struk", value: "id_deposit_kelas"},        
        { text: "ID Member", value: "id_member"},                        
        { text: "Deposit", value: "jumlah_pembayaran_deposit_kelas"},        
        { text: "Kelas", value: "kelas_foreign_key.nama_kelas"},        
        { text: "Total", value: "total_deposit_kelas"},
        { text: "Tanggal", value: "tanggal_deposit_kelas"},                     
        { text: "Masa Berlaku", value: "tanggal_kadaluarsa_deposit_kelas"},
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
      return this.members.find((member) => member.id_member === this.form.id_member) || {};
    },
    selectedKelas() {      
      return this.kelass.find((kelas) => kelas.id_kelas === this.form.id_kelas) || {};
    },
    selectedPegawai() {
        return this.pegawais.find((pegawai) => pegawai.id_pegawai === this.form.id_pegawai) || {};
    },
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataMember();
    this.getDataKelas();    
    this.getDataPegawai();
    this.getDataTransaksiDepositKelas();
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

    getDataTransaksiDepositKelas() {
      this.load = true;
      var url = this.$api + "/transaksiDepositKelas";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.transaksiDepositKelass = response.data.data;
          this.load = false;
        });
      this.load = true;
    },

    saveTransaksiDepositKelas() {            
      let newData = {
        id_pegawai: this.getIdPegawai(),
        id_member: this.form.id_member,         
        id_kelas: this.form.id_kelas,                
        jumlah_deposit_kelas: this.form.jumlah_deposit_kelas,            
        jumlah_pembayaran_deposit_kelas: this.form.jumlah_pembayaran_deposit_kelas,              
      };

      var url = this.$api + "/transaksiDepositKelas";
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
          this.getDataTransaksiDepositKelas();
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
      var url = this.$api + "/transaksiDepositKelas/" + this.deleteId;
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
          this.getDataTransaksiDepositKelas();
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
      this.getDataTransaksiDepositKelas();
    },
    close() {
      this.dialog = false;
      this.inputType = "Add";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataTransaksiDepositKelas();
    },
    closeDialogShowDetails() {
      this.dialogShowDetails = false;
      this.resetForm();
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_deposit_kelas;
      this.dialog = true;
    },
    deleteHandler(id_deposit_kelas) {
      this.deleteId = id_deposit_kelas;
      this.dialogConfirm = true;
    },
    getHandler(item) {
      this.editId = item.id_deposit_kelas;
      this.form.id_deposit_kelas = item.id_deposit_kelas;
      this.form.id_member = item.id_member;
      this.form.id_kelas = item.id_kelas;      
      this.form.id_pegawai = item.id_pegawai;
      this.form.tanggal_deposit_kelas = item.tanggal_deposit_kelas;
      this.form.jumlah_pembayaran_deposit_kelas = item.jumlah_pembayaran_deposit_kelas;
      this.form.jumlah_deposit_kelas = item.jumlah_deposit_kelas;
      this.form.bonus_deposit_kelas = item.bonus_deposit_kelas;
      this.form.total_deposit_kelas = item.total_deposit_kelas;
      this.form_tanggal_kadaluarsa_deposit_kelas = item.tanggal_kadaluarsa_deposit_kelas;
      this.dialogShowDetails = true;
    },
    resetForm() {
      this.form = {
        id_member: "",
        id_kelas: "",        
        jumlah_pembayaran_deposit_kelas: "",                
      };
    },

    generatePDF(item) {         
      this.editId = item.id_deposit_kelas;
      this.form.id_deposit_kelas = item.id_deposit_kelas;
      this.form.id_member = item.id_member;
      this.form.id_kelas = item.id_kelas;      
      this.form.id_pegawai = item.id_pegawai;
      this.form.tanggal_deposit_kelas = item.tanggal_deposit_kelas;
      this.form.jumlah_pembayaran_deposit_kelas = item.jumlah_pembayaran_deposit_kelas;
      this.form.jumlah_deposit_kelas = item.jumlah_deposit_kelas;
      this.form.bonus_deposit_kelas = item.bonus_deposit_kelas;
      this.form.total_deposit_kelas = item.total_deposit_kelas;
      this.form_tanggal_kadaluarsa_deposit_kelas = item.tanggal_kadaluarsa_deposit_kelas;

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text("GOFIT", 80, 15, "center");

      // Alamat
      doc.setFontSize(10);
      doc.text("Jl. Centralpark No. 10 Yogyakarta", 80, 25, "center");

      // Judul Struk
      doc.setFontSize(18);
      doc.text("Struk Pembayaran Deposit Kelas", 80, 40, "center");

      // Informasi Transaksi
      doc.setFontSize(12);
      doc.text(`No Struk: ${item.id_deposit_kelas}`, 20, 60);
      doc.text(`Tanggal: ${item.tanggal_deposit_kelas}`, 20, 70);
      doc.text(`Kasir: ${item.id_pegawai} / ${item.pegawai_foreign_key.nama_pegawai}`, 20, 80);
      doc.text(`Member: ${item.id_member} / ${this.selectedMember.nama_member}`, 20, 90);
      doc.text(`Deposit (bayar ${item.jumlah_deposit_kelas} gratis ${item.bonus_deposit_kelas}): Rp.${item.jumlah_pembayaran_deposit_kelas},- (${item.jumlah_deposit_kelas} x Rp.${this.selectedKelas.harga_kelas})`, 20, 100);
      doc.text(`Jenis Kelas: ${this.selectedKelas.nama_kelas}`, 20, 110);
      doc.text(`Total Deposit ${this.selectedKelas.nama_kelas}: ${item.total_deposit_kelas}`, 20, 120);
      doc.text(`Berlaku sampai dengan: ${item.tanggal_kadaluarsa_deposit_kelas}`, 20, 130);

      // Garis pemisah
      doc.setLineWidth(0.5);
      doc.line(20, 135, 190, 135);

      // Footer
      doc.setFontSize(8);
      doc.text("Terima kasih atas kunjungan Anda!", 80, 150, "center");

      doc.save("struk_transaksi_deposit_kelas.pdf");

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