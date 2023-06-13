<template>
  <div>
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
    <v-main class="dashboard">
      <div class="container-center">                
          <div class="text-center">
            <h2 class="textGofit" data-aos="zoom-out-down" data-aos-duration="2500">
              <span class="textGofit2">Welcome</span>Our<span class="textGofit2">{{ getRole() }}</span>
            </h2>          
        </div>     
      </div>
      <div class="content-style">
      </div>
    </v-main>
  </div>
</template>

<script>
  import {    

  } from '@mdi/js'

  export default {

  data() {
    return {
      icons: {

      },
      drawer: true,
      dialogLogout: false,
      mini: true,
    };
  },
  methods: {
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
  },
};
</script>

<style scoped>

.container-center{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.center-text {
  text-align: center;
  transition: 1s ease-in-out;  
  cursor: pointer;
}

.center-text:hover {
  color: rgba(255, 255, 255, 0.8);
  font-size: 5em;  
}

.dashboard {
  background-color: rgb(255, 230, 0);
  height: 100%;
  transition: 2s ease-in-out;  
}

.dashboard:hover {
  background-color: rgb(30, 69, 223);
}

.content-style {
  margin-top: 10%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 10%;
}


</style>
