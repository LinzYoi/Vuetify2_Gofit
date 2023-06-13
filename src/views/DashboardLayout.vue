<template>
  <div class="wrapper">
    <div class="box">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- new navbar  -->
    <!--Main Navigation-->
    <header>
      <!-- Navbar -->
      <nav id="main-navbar" class="navbar navbar-expand fixed-top" style="height: 130px">
        <!-- Container wrapper -->
        <div class="container-fluid">
          <!-- Toggle button -->
          <button
            class="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>

          <!-- Brand -->
          <ul class="navbar-nav ms-auto d-flex flex-row">                            
            <li class="nav-item me-3 me-lg-0">              
                <h1 class="router-link">GOFIT</h1>                              
            </li>
          </ul>
          

          <!-- Left links -->
          <div class="collapse navbar-collapse" id="navbarNav">          
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="loggedInAdmin">
              <li class="nav-item mx-4">
                <router-link to="/dashboard" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Dashboard</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/instruktur" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Data Instruktur</span>     
                </router-link>
              </li>
            </ul>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="loggedInMO">
              <li class="nav-item mx-4">
                <router-link to="/dashboard" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Dashboard</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/jadwal" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Jadwal Umum</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/jadwal-harian" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Jadwal Harian</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/izin-instruktur" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Izin Instruktur</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/laporan-aktivitas-gym-bulanan" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Laporan Gym</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/laporan-aktivitas-kelas-bulanan" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Laporan Kelas</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/laporan-kinerja-Instruktur-bulanan" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Laporan Kinerja Instruktur</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/laporan-pendapatan-per-bulan-dalam-tahun-tertentu" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Laporan Pendapatan</span>     
                </router-link>
              </li>
            </ul>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="loggedInKasir">
              <li class="nav-item mx-4">
                <router-link to="/dashboard" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Dashboard</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/member" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">List Member</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/transaksi-aktivasi" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Transaksi Aktivasi</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/transaksi-deposit-uang" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Transaksi Deposit Uang</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/transaksi-deposit-kelas" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Transaksi Deposit Kelas</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/reset-deposit-kelas" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Reset Deposit Kelas</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/presensi-member-gym" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Presensi Member Gym</span>     
                </router-link>
              </li>
              <li class="nav-item mx-4">
                <router-link to="/presensi-member-kelas" class="list-group-item list-group-item-action py-2 ripple">
                  <span class="router-link me-3">Presensi Member Kelas</span>     
                </router-link>
              </li>
            </ul>
          </div>
          <!-- Left links -->
          
          <!-- Right links -->
          <ul class="navbar-nav ms-auto d-flex flex-row">                    
            
            <li class="nav-item me-3 me-lg-0" id="textBlack">
              <router-link to="#" class="list-group-item py-2 nav-link" id="textBlack">
                <span class="router-link">{{ getName() }}</span>                
              </router-link>               
            </li>
            <li class="nav-item me-3 me-lg-0">
              <a class="nav-link" href="#" id="textBlack">
                <i class="fas fa-gear router-link"></i>
              </a>
            </li>
            <li class="nav-item me-3 me-lg-0">
              <a class="nav-link" id="textBlack" @click="dialogLogout = true">
                <i class="fas fa-right-from-bracket router-link"></i>
              </a>
            </li>

          </ul>
        </div>
        <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->      
    </header>    
    <!-- new navbar  -->

    <!-- dialogLogout -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialogLogout" max-width="370">
          <v-card>
            <v-card-title class="text-h5">Are you sure want to Logout?</v-card-title>            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialogLogout = false">No</v-btn>
              <v-btn color="green darken-1" text @click="btnLogout">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- dialogLogout -->
    

    <!-- router view -->
    <div class="fullheight">
      <router-view></router-view>
    </div>    
    <!-- router view -->
  </div>
  
</template>

<script>
  import {
    mdiSetting,
    mdiPencil,
    mdiSettingsHelper,
    mdiCog,
    mdiLogout,
  } from '@mdi/js'

  export default {

  data() {
    return {
      icons: {
        mdiSetting,
        mdiPencil,
        mdiSettingsHelper,
        mdiCog,
        mdiLogout,
      },
      drawer: true,
      dialogLogout: false,
      mini: true,
    };
  },
  methods: {
    btnLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("id_pegawai");
      localStorage.removeItem("nama_pegawai");
      localStorage.removeItem("role_pegawai");
      this.$router.push("/");
    },
    btnProfile() {
      this.$router.push("/profile");
    },
    getName() {
      if (localStorage.getItem("id_pegawai") != null) {
        return localStorage.getItem("nama_pegawai");
      } else {
        return localStorage.getItem("nama_member");
      }
    },
    getRole() {
      return localStorage.getItem("role_pegawai");
    },
    handleScroll() {
      const navbar = document.getElementById('main-navbar');
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollPosition > this.lastScrollPosition) {
        // Scroll ke bawah
        navbar.classList.remove('navbar-visible');
        navbar.classList.add('navbar-hidden');
      } else {
        // Scroll ke atas
        navbar.classList.remove('navbar-hidden');
        navbar.classList.add('navbar-visible');
      }

      this.lastScrollPosition = scrollPosition;
    },
  },
  computed: {
    loggedIn() {
      return localStorage.getItem("token") != null;
    },
    loggedInAdmin() {
      return localStorage.getItem("role_pegawai") == "Admin";
    },
    loggedInMO() {
      return localStorage.getItem("role_pegawai") == "MO";
    },
    loggedInKasir() {
      return localStorage.getItem("role_pegawai") == "Kasir";
    },
  },
  mounted() {
    this.getName();
    this.getRole();
    window.addEventListener('scroll', this.handleScroll);
  },
};
</script>

<style>

html, body {
  height: 100%;
  margin: 0;
}

.wrapper {  
  display: flex;
  flex-direction: column;
}

.fullheight {
  flex: 1;  
}

body {
  background-color: #000000; /* default background color */
  transition: background-color 0.5s ease-in-out; /* transition effect */
}
  
.background-color {
  background-color: #ffffff;
}

.text-color {
  color: #ffffff;
}

#main-navbar {
  background-color: transparent;
  box-shadow: none;
}

.navbar-nav {  
  display: flex;
  margin: 30px auto;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  transition: transform 0.5s ease-in-out;
}

.navbar-hidden {
  transform: translateY(-100%);
}

.navbar-visible {
  transform: translateY(0);
}

.router-link {
  color: rgb(0, 0, 0);
  text-decoration: none;
  transition: color 0.3s ease-in-out;  
}

.router-link::after {
  content: '';
  height: 2px;
  width: 0%;
  background-color: rgb(255, 255, 255);  
  display: block;
  transition: .5s ease-in-out;
}

.router-link:hover::after, .router-link-active {  
  content: '';
  height: 2px;
  width: 100%;  
  display: block;  
}

.router-link-active span {
  color: rgb(255, 255, 255);  
}


#textBlack {  
  color: #656565;
}

#textWhite {
  color: #cccbcb;
}

.box div {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: transparent;
  border: 6px solid rgba(255, 255, 255, 0.8)
}

.box div:nth-child(1) {
  top: 12%;
  left: 42%;
  animation: animate 10s linear infinite;
}
.box div:nth-child(2) {
  top: 70%;
  left: 50%;
  animation: animate 7s linear infinite;
}
.box div:nth-child(3) {
  top: 17%;
  left: 6%;
  animation: animate 9s linear infinite;
}
.box div:nth-child(4) {
  top: 20%;
  left: 60%;
  animation: animate 10s linear infinite;
}
.box div:nth-child(5) {
  top: 67%;
  left: 10%;
  animation: animate 6s linear infinite;
}
.box div:nth-child(6) {
  top: 80%;
  left: 70%;
  animation: animate 12s linear infinite;
}
.box div:nth-child(7) {
  top: 60%;
  left: 80%;
  animation: animate 15s linear infinite;
}
.box div:nth-child(8) {
  top: 32%;
  left: 25%;
  animation: animate 16s linear infinite;
}
.box div:nth-child(9) {
  top: 90%;
  left: 25%;
  animation: animate 16s linear infinite;
}
.box div:nth-child(10) {
  top: 20%;
  left: 80%;
  animation: animate 5s linear infinite;
}

@keyframes animate{
  0%{
    transform: scale(0) translateY(-90px) rotate(360deg) 
  }
  100%{
    transform: scale(1.3) translateY(-90px) rotate(0deg);
    opacity: 0;
  }
}
</style>