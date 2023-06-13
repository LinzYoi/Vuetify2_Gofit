<template>
  <v-main>
    <v-breadcrumbs :items="items" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card v-if="!$vuetify.breakpoint.mobile">
      <div style="display: flex">
        <v-col :cols="$vuetify.breakpoint.mobile ? '' : '1'" sm="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Data"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>
        <div style="margin-top: 5px" class="ml-auto">
          <v-btn
            class="mx-2 mt-4 mb-4"
            color="#1428de"
            style="font-weight: bold; color: white"
            @click="dialog = true"
          >
            Tambah Data
          </v-btn>
        </div>
      </div>
    </v-card>
    <v-card v-else>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Cari Data"
        single-line
        hide-details
        outlined
        style="margin-left: 15px; margin-right: 15px"
      ></v-text-field>
      <div style="margin-left: 15px; margin-right: 15px">
        <v-btn
          class="mt-2 mb-2"
          color="#1428de"
          style="font-weight: bold; color: white; width: 100%"
          @click="dialog = true"
        >
          Tambah Data
        </v-btn>
      </div>
    </v-card>
    <v-card style="margin-top: 20px">
      <v-data-table
        :headers="headers"
        :items="promos"
        :search="search"
        :loading="load"
        loading-text="Sedang mengambil data"
        no-data-text="Tidak ada Data"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="green" class="mr-2" @click="editHandler(item)">
            Update
          </v-btn>
          <v-btn color="red" class="mr-2" @click="deleteHandler(item.id_promo)">
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <div
            :style="!$vuetify.breakpoint.mobile ? 'display: flex;' : ''"
            style="width: 100%"
          >
            <span class="headline">{{ formTitle }} Promo</span>
            <div style="margin-left: auto">
              <v-btn color="red" @click="cancel"> Batal </v-btn>
              <v-btn
                style="margin-left: 15px"
                color="#1428de"
                @click="dialogConfirmEdit = true"
              >
                Simpan
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <hr />
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_promo"
              label="Promo"
              required
              outlined
              :rules="error.nama_promo"
            ></v-text-field>
            <v-text-field
              v-model="form.keterangan"
              label="Keterangan"
              required
              outlined
              :rules="error.keterangan"
            ></v-text-field>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirmEdit" persistent max-width="400px">
      <v-card>
        <v-card-title style="justify-content: center">
          <img
            src="@/assets/icons/alert.png"
            alt="warning"
            width="50"
            height="50"
          />
        </v-card-title>
        <v-card-text> Apakah anda yakin </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="cancel"> Batal</v-btn>
          <v-btn color="#1428de" @click="setForm"> Yakin </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title style="justify-content: center">
          <img
            src="@/assets/icons/alert.png"
            alt="warning"
            width="50"
            height="50"
          />
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus data ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="dialogConfirm = false"> Batal </v-btn>
          <v-btn color="#1428de" @click="deleteData"> Hapus </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" bottom
      >{{ error_message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      deleteId: "",
      editId: "",
      inputType: "Tambah",
      search: null,
      load: false,
      snackbar: false,
      promos: [],
      promo: new FormData(),
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      form: {
        nama_promo: "",
        keterangan: "",
      },
      error: {
        nama_promo: [(v) => !!v || "Nama Promo tidak boleh kosong"],
        keterangan: [(v) => !!v || "Keterangan tidak boleh kosong"],
      },
      items: [
        {
          text: "...",
          disabled: true,
        },
        {
          text: "Promo",
          disabled: false,
        },
      ],
      headers: [
        {
          text: "Nama Promo",
          value: "nama_promo",
        },
        {
          text: "Keterangan",
          value: "keterangan",
        },
        {
          text: "Action",
          value: "actions",
        },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.getDataPromo();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Tambah") {
        this.updatePromo();
      } else {
        this.submitPromo();
      }
    },
    getDataPromo() {
      this.load = true;
      var url = this.$api + "/promo";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.promos = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    submitPromo() {
      this.promo.append("nama_promo", this.form.nama_promo);
      this.promo.append("keterangan", this.form.keterangan);

      var url = this.$api + "/promo";
      this.load = true;
      this.$http
        .post(url, this.promo, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Berhasil menambahkan data";
          this.color = "green";
          this.snackbar = true;
          this.load = true;
          this.close();
          this.getDataPromo();
          this.resetForm();
        })
        .catch(() => {
          this.error_message = "Silahkan periksa kembali";
          this.color = "red";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    updatePromo() {
      let newData = {
        nama_promo: this.form.nama_promo,
        keterangan: this.form.keterangan,
      };
      var url = this.$api + "/promo/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.error_message = "Berhasil memperbarui data";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.getDataPromo();
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch(() => {
          this.error_message = "Silahkan periksa kembali";
          this.color = "red";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/promo/" + this.deleteId;
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
          this.getDataPromo(); //mengambil data
          this.resetForm();
          location.reload();
          this.inputType = "Tambah";
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
      this.inputType = "Tambah";
      (this.error = {
        nama_promo: false,
        keterangan: false,
      }),
        this.resetForm();
      this.getDataPromo();
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataPromo();
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_promo;
      this.form.nama_promo = item.nama_promo;
      this.form.keterangan = item.keterangan;
      this.dialog = true;
    },
    deleteHandler(id_promo) {
      this.deleteId = id_promo;
      this.dialogConfirm = true;
    },
    resetForm() {
      this.form = {
        nama_promo: "",
        keterangan: "",
      };
    },
  },
};
</script>

<style>
#app {
  margin-top: -10px;
  background-color: #ffffff;
}
@media screen {
  .v-data-table > .v-data-table__wrapper > table > tbody > tr:nth-child(odd) {
    border-left: 6px solid #1428de;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr:nth-child(even) {
    border-left: 6px solid #ffffff;
  }
}
</style>
