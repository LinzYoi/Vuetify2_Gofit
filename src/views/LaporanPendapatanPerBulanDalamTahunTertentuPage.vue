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
          <v-data-table :headers="headers" :items="laporanPendapatanPerBulanDalamTahunTertentus" :search="search" :loading="load" loading-text="Loading..." no-data-text="No Data">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mr-2" @click="generatePDF(item)">{{ icons.mdiPrinter }}</v-icon>
            </template>
          </v-data-table>
        </template>
      </v-card>

      <v-card class="mt-5">
        <div class="d-flex">
          <v-card-title>Grafik Total Pendapatan</v-card-title>
          <div class="ml-auto mr-3 mt-3">
            <v-btn class="ma-2" outlined fab color="indigo" @click="dialog = true">
            <v-icon @click="generatePDFChart()">{{ icons.mdiPrinter }}</v-icon></v-btn>
          </div>
        </div>

        <template>          
          <canvas id="chart"></canvas>
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
import axios from "axios";
import { mdiPlus, mdiPencil, mdiDelete, mdiEye, mdiPrinter } from "@mdi/js";
import { jsPDF } from "jspdf";
import { Chart} from 'chart.js';
import "jspdf-autotable";
import "blueimp-canvas-to-blob";

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

      laporanPendapatanPerBulanDalamTahunTertentus: [],
      laporanPendapatanPerBulanDalamTahunTertentu: new FormData(),                

      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      dialogLoading: false,
      dialogShowDetails: false,

      items: [
        { text: "...", disabled: true },
        { text: "Laporan Pendapatan Per Bulan Dalam Tahun Tertentu", disabled: false },
      ],
      headers: [
        { text: "Bulan", value: "nama_bulan"},
        { text: "Aktivasi", value: "total_pendapatan_aktivasi"},
        { text: "Deposit", value: "total_pendapatan_deposit"},                
        { text: "Total", value: "total_pendapatan"},
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
    this.getDataLaporanPendapatanPerBulanDalamTahunTertentu();
    this.getDataLaporanPendapatan();
  },
  methods: {
    getIdPegawai() {
      return localStorage.getItem("id_pegawai");
    },

    getNamaPegawai() {      
      return localStorage.getItem("nama_pegawai");      
    },

    getDataLaporanPendapatanPerBulanDalamTahunTertentu() {
      this.load = true;
      var url = this.$api + "/laporanPendapatanPerBulanDalamTahunTertentu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.laporanPendapatanPerBulanDalamTahunTertentus = response.data.data;          
        //   this.renderChart();
          this.load = false;
        });
      this.load = true;
    },

    async getDataLaporanPendapatan() {
      const url = 'https://backendgofit.gofitceria.com/public/api/laporanPendapatanPerBulanDalamTahunTertentu';
      const headers = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };
        
      try {
        const response = await axios.get(url, { headers });
        console.log(response.data.data);
        this.dataJadwal = response.data.data;        
        this.renderChart();
      } catch (error) {
        console.error(error);
      }
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

        doc.text("LAPORAN PENDAPATAN BULANAN", 10, 30);
        doc.text(`Tanggal Cetak: ${tanggalCetak}`, 10, 40);

        doc.text(`Bulan: ${item.nama_bulan}`, 10, 50);    
        doc.text(`Aktivasi: ${item.total_pendapatan_aktivasi}`, 10, 60);
        doc.text(`Deposit: ${item.total_pendapatan_deposit}`, 10, 70);
        doc.text(`Total: ${item.total_pendapatan}`, 10, 80);    

        doc.save("laporan_pendapatan_per_bulan_dalam_tahun_tertentu.pdf");
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
        doc.text("LAPORAN PENDAPATAN BULANAN", 10, 30);  
        doc.text(`Tanggal Cetak: ${tanggalCetak}`, 10, 40);

        doc.autoTable({
            startY: 50,
            head: [["Bulan", "Aktivasi", "Deposit", "Total"]],
            body: this.laporanPendapatanPerBulanDalamTahunTertentus.map(item => [item.nama_bulan, item.total_pendapatan_aktivasi, item.total_pendapatan_deposit, item.total_pendapatan]),

            margin: { top: 40 },
            styles: { overflow: 'linebreak' },
            theme: 'grid',
            showHead: 'everyPage',
            footStyles: { fontSize: 10 },
            headStyles: { fontSize: 10 },
            bodyStyles: { fontSize: 10 },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text("Gofit", 10, 10);
            doc.text("Jl. Centralpark No. 10 Yogyakarta", 10, 20);
            doc.text("LAPORAN PENDAPATAN BULANAN", 10, 30);    
        }  

        doc.save("laporan_pendapatan_per_bulan_dalam_tahun_tertentu.pdf");
    },

    renderChart() {
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.dataJadwal.map(row => row.nama_bulan),
                datasets: [
                    {
                        label: 'Aktivasi',
                        data: this.dataJadwal.map(row => row.total_pendapatan_aktivasi),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Deposit',
                        data: this.dataJadwal.map(row => row.total_pendapatan_deposit),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Total',
                        data: this.dataJadwal.map(row => row.total_pendapatan),
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        beginAtZero: true
                    }
                }
            }
        });
    },

    async generatePDFChart() {
      const canvas = document.getElementById("chart");
      const dataURL = canvas.toDataURL("image/png");

      const img = new Image();
      img.src = dataURL;

      img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const imgData = URL.createObjectURL(blob);
        const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("laporan_pendapatan_per_bulan_dalam_tahun_tertentu_chart.pdf");
      }, "image/png");

      // Clean up
      URL.revokeObjectURL(img.src);
      };
    },

    async getImageData(img) {
      return new Promise((resolve) => {
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(function (blob) {
            resolve(blob);
          }, "image/png"); // Add the MIME type parameter

          // Clean up
          document.body.removeChild(canvas);
        };

        // Append the image to the document body
        document.body.appendChild(img);
      });
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