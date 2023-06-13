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
        :items="pegawais"
        :search="search"
        :loading="load"
        loading-text="Sedang mengambil data"
        no-data-text="Tidak ada Data"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="green" class="mr-2" @click="editHandler(item)">
            Update
          </v-btn>
          <v-btn
            color="red"
            class="mr-2"
            @click="deleteHandler(item.id_pegawai)"
          >
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
            <span class="headline">{{ formTitle }} Pegawai</span>
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
              v-model="form.nama_pegawai"
              label="Nama Pegawai"
              required
              outlined
              :rules="error.nama_pegawai"
            ></v-text-field>
            <v-text-field
              v-model="form.alamat"
              label="Alamat"
              required
              outlined
              :rules="error.alamat"
            ></v-text-field>
            <v-text-field
              v-model="form.no_telp"
              label="Nomor Telepon"
              required
              outlined
              :rules="error.no_telp"
            ></v-text-field>
            <v-text-field
              v-model="form.gaji"
              label="Gaji"
              required
              outlined
              :rules="error.gaji"
            ></v-text-field>
            <v-text-field
              v-model="form.email_pegawai"
              label="Email"
              required
              outlined
              :rules="error.email_pegawai"
            ></v-text-field>
            <v-text-field
              v-model="form.tgl_lahir"
              label="Tanggal Lahir"
              required
              type="date"
              outlined
              :rules="error.tgl_lahir"
            ></v-text-field>
            <v-text-field
              v-model="form.username"
              label="Username"
              required
              outlined
              :rules="error.username"
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              label="Password"
              required
              outlined
              :rules="error.password"
            ></v-text-field>
            <v-select
              :items="peran"
              v-model="form.role"
              label="Peran "
              item-value="value"
              outlined
              :rules="error.role"
              item-text="text"
            ></v-select>
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
      pegawais: [],
      pegawai: new FormData(),
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      form: {
        nama_pegawai: "",
        no_telp: "",
        alamat: "",
        role: "",
        gaji: "",
        email_pegawai: "",
        username: "",
        password: "",
        tgl_lahir: "",
      },
      error: {
        nama_pegawai: [(v) => !!v || "Field required"],
        no_telp: [(v) => !!v || "Field required"],
        alamat: [(v) => !!v || "Field required"],
        role: [(v) => !!v || "Field required"],
        gaji: [(v) => !!v || "Field required"],
        email_pegawai: [(v) => !!v || "Field required"],
        username: [(v) => !!v || "Field required"],
        password: [(v) => !!v || "Field required"],
        tgl_lahir: [(v) => !!v || "Field required"],
      },
      items: [
        {
          text: "...",
          disabled: true,
        },
        {
          text: "Pegawai",
          disabled: false,
        },
      ],
      headers: [
        {
          text: "Nama Pegawai",
          value: "nama_pegawai",
        },
        {
          text: "Tanggal Lahir",
          value: "tgl_lahir",
        },
        {
          text: "Nomor Telepon",
          value: "no_telp",
        },
        {
          text: "Email",
          value: "email_pegawai",
        },
        {
          text: "Peran",
          value: "role",
        },
        {
          text: "Action",
          value: "actions",
        },
      ],
      peran: [
        {
          text: "Admin",
          value: "admin",
        },
        {
          text: "Manager Operasional",
          value: "manager operasional",
        },
        {
          text: "Kasir",
          value: "kasir",
        },
        {
          text: "Developer - Testing",
          value: "developer",
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
    this.getDataPegawai();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Tambah") {
        this.updatePegawai();
      } else {
        this.submitPegawai();
      }
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
    submitPegawai() {
      this.pegawai.append("nama_pegawai", this.form.nama_pegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("no_telp", this.form.no_telp);
      this.pegawai.append("gaji", this.form.gaji);
      this.pegawai.append("email_pegawai", this.form.email_pegawai);
      this.pegawai.append("username", this.form.username);
      this.pegawai.append("password", this.form.password);
      this.pegawai.append("tgl_lahir", this.form.tgl_lahir);
      this.pegawai.append("role", this.form.role);

      var url = this.$api + "/pegawai";
      this.load = true;
      this.$http
        .post(url, this.pegawai, {
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
          this.getDataPegawai();
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
    updatePegawai() {
      let newData = {
        nama_pegawai: this.form.nama_pegawai,
        no_telp: this.form.no_telp,
        alamat: this.form.alamat,
        role: this.form.role,
        gaji: this.form.gaji,
        email_pegawai: this.form.email_pegawai,
        username: this.form.username,
        password: this.form.password,
        tgl_lahir: this.form.tgl_lahir,
      };
      var url = this.$api + "/pegawai/" + this.editId;
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
          this.getDataPegawai();
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
      var url = this.$api + "/pegawai/" + this.deleteId;
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
          this.getDataPegawai(); //mengambil data
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
        nama_pegawai: false,
        no_telp: false,
        alamat: false,
        role: false,
        gaji: false,
        email_pegawai: false,
        username: false,
        password: false,
        tgl_lahir: false,
      }),
        this.resetForm();
      this.getDataPegawai();
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataPegawai();
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_pegawai;
      this.form.nama_pegawai = item.nama_pegawai;
      this.form.no_telp = item.no_telp;
      this.form.alamat = item.alamat;
      this.form.role = item.role;
      this.form.gaji = item.gaji;
      this.form.email_pegawai = item.email_pegawai;
      this.form.tgl_lahir = item.tgl_lahir;
      this.form.username = item.username;
      //   this.form.password = item.password;
      this.dialog = true;
    },
    deleteHandler(id_pegawai) {
      this.deleteId = id_pegawai;
      this.dialogConfirm = true;
    },
    resetForm() {
      this.form = {
        nama_pegawai: "",
        no_telp: "",
        alamat: "",
        role: "",
        gaji: "",
        email_pegawai: "",
        username: "",
        password: "",
        tgl_lahir: "",
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
