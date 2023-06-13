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
            <v-icon @click="generatePDFAll()">{{ icons.mdiPrinter }}</v-icon></v-btn>
          </div>
        </div>

        <template>          
          <v-data-table :headers="headers" :items="laporanAktivitasGymBulanans" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
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
import { mdiPlus, mdiPencil, mdiDelete, mdiEye, mdiPrinter } from "@mdi/js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

      items: [],
      tanggalCetak: null,
      laporanAktivitasGymBulanans: [],
      laporanAktivitasGymBulanan: new FormData(),      

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,


      headers: [
        { text: "Tanggal", value: "tanggal"},        
        { text: "Jumlah Member", value: "count"},             
        { text: "Actions", value: "actions", sortable: false },
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
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataLaporanAktivitasGymBulanan();
  },
  methods: {
    getIdPegawai() {
      return localStorage.getItem("id_pegawai");
    },

    getNamaPegawai() {      
      return localStorage.getItem("nama_pegawai");      
    },

    getDataLaporanAktivitasGymBulanan() {
        this.load = true;
        var url = this.$api + "/laporanAktivitasGymBulanan";
        this.$http
        .get(url, {
            headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
        .then((response) => {
            this.laporanAktivitasGymBulanans = response.data.data.data_laporan;
            this.tanggalCetak = response.data.data.tanggal_cetak;

            this.items = this.laporanAktivitasGymBulanans.map((item) => {
            return {
                ...item,
                tanggal_cetak: this.tanggalCetak ? this.tanggalCetak.tanggal_cetak : null,
            };
            });
            this.load = false;
        });
    },


    generatePDF(item) {            
        const doc = new jsPDF();
        const tanggalCetak = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        doc.text("Gofit", 10, 10);
        doc.text("Jl. Centralpark No. 10 Yogyakarta", 10, 20);

        doc.text("LAPORAN AKTIVITAS GYM Bulanan", 10, 30);
        doc.text(`Tanggal Cetak : ${tanggalCetak}`, 10, 40);

        doc.text(`Tanggal: ${item.tanggal}`, 10, 50);
        doc.text(`Jumlah Member: ${item.count}`, 10, 60);

        doc.save("laporan_aktivitas_gym_bulanan.pdf");
    },

    generatePDFAll() {
        const doc = new jsPDF();
        const tanggalCetak = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        doc.setFontSize(12);

        doc.text("Gofit", 10, 10);
        doc.text("Jl. Centralpark No. 10 Yogyakarta", 10, 20);
        doc.text("LAPORAN AKTIVITAS GYM Bulanan", 10, 30);
        doc.text(`Tanggal Cetak : ${tanggalCetak}`, 10, 40);

        doc.autoTable({
            startY: 50,
            head: [["Tanggal", "Jumlah Member"]],
            body: this.laporanAktivitasGymBulanans.map(item => [item.tanggal, item.count]),
            margin: { top: 40 },
            styles: { overflow: 'linebreak' },
            theme: 'grid',
            showHead: 'everyPage',
            footStyles: { fontSize: 10 },
            headStyles: { fontSize: 10 },
            bodyStyles: { fontSize: 10 },
        });

        const totalPages = doc.internal.getNumberOfPages();

        // Hitung total jumlah member
        let totalMember = 0;
        this.laporanAktivitasGymBulanans.forEach(item => {
            totalMember += item.count;
        });

        // Tambahkan baris terakhir dengan total jumlah member
        doc.setPage(totalPages);
        doc.autoTable({
            body: [['Total', totalMember]],
            margin: { top: doc.previousAutoTable.finalY + 10 },
            styles: { fontSize: 10, fontStyle: 'bold' },
            theme: 'grid',
            showHead: 'never',
        });

        doc.save("laporan_aktivitas_gym_bulanan.pdf");
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