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
          <v-data-table :headers="headers" :items="items" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">                
              <v-icon class="mr-2" @click="generatePDF(item)">{{ icons.mdiPrinter }}</v-icon>
            </template>
          </v-data-table>
        </template>

      </v-card>      
    
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
      presensiBookingKelasId: "",
      editId: "",
      inputType: "Add",
      search: null,
      load: false,
      snackbar: false,

      items: [],
      members: [],
      depositKelasMembers: [],
      presensiBookingKelass: [],      

      error_message: "",
      dialog: false,
      color: "",                  
      dialogLoading: false,      

      // items: [
      //   { text: "...", disabled: true },
      //   { text: "Presensi Booking Kelas", disabled: false },
      // ],
      headers: [
        { text: "No Struk", value: "id_booking_kelas" },
        { text: "Nama Member", value: "member_foreign_key.nama_member" },
        { text: "Nama Instruktur", value: "jadwal_harian_foreign_key.instruktur_foreign_key.nama_instruktur" },
        { text: "Tanggal Booking", value: "tanggal_booking" },
        { text: "Tanggal Yang Dibooking", value: "tanggal_yang_dibooking" },
        { text: "Hari Kelas", value: "jadwal_harian_foreign_key.jadwal_umum_foreign_key.hari" },
        { text: "Hari Kelas", value: "jadwal_harian_foreign_key.jadwal_umum_foreign_key.jam" },
        { text: "Waktu Presensi", value: "waktu_presensi" },
        
        // { text: "Sisa Deposit", value: "sisa_deposit" },
        // { text: "Tanggal Kadaluarsa", value: "tanggal_kadaluarsa" },        

        { text: "Status Member", value: "status_member" },
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
    this.getDataPresensiBookingKelas();    
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

    getDataPresensiBookingKelas() {
      this.load = true;
      var url = this.$api + "/presensiBookingKelas";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {                    
          this.presensiBookingKelass = response.data.data.presensi_booking_kelas;
          this.depositKelasMembers = response.data.data.deposit_kelas_member;

          // Combine the items from both arrays into a new array
          this.items = this.presensiBookingKelass.map((item, index) => {
            const depositItem = this.depositKelasMembers[index];
            return {
              ...item,
              sisa_deposit: depositItem ? depositItem.sisa_deposit : null,
              tanggal_kadaluarsa: depositItem ? depositItem.tanggal_kadaluarsa : null,
              id_deposit_kelas_member: depositItem ? depositItem.id_deposit_kelas_member : null,
              id_kelas: depositItem ? depositItem.id_kelas : null,
            };
          });

          this.load = false;
        });
    },

    generatePDF(item) {
      const doc = new jsPDF();

      doc.text("Gofit", 10, 10);
      doc.text("Jl. Centralpark No. 10 Yogyakarta", 10, 20);

      doc.text("STRUK PRESENSI KELAS", 10, 40);
      doc.text(`No Struk: ${item.id_booking_kelas}`, 10, 50);
      doc.text(`Tanggal: ${item.waktu_presensi}`, 10, 60);

      doc.text(`Member: ${item.id_member} / ${item.member_foreign_key.nama_member}`, 10, 80);
      doc.text(`Kelas: ${item.jadwal_harian_foreign_key.jadwal_umum_foreign_key.kelas_foreign_key.nama_kelas}`, 10, 90);
      doc.text(`Instruktur: ${item.jadwal_harian_foreign_key.instruktur_foreign_key.nama_instruktur}`, 10, 100);


      if (item.id_deposit_kelas_member !== null) {
        doc.text(`Sisa Deposit: ${item.sisa_deposit}x`, 10, 110);
        doc.text(`Masa Berlaku: ${item.tanggal_kadaluarsa}`, 10, 120);
      } else {
        doc.text(`Tarif: ${item.tarif}`, 10, 110);
        doc.text(`Sisa Deposit: Rp.${item.member_foreign_key.sisa_deposit_uang_member}`, 10, 120);
      }               

      doc.save("struk_presensi_booking_kelas.pdf");
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