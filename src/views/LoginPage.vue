<template>
  <v-app>   
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
    <!-- Section: Design Block -->
    <section class="text-center" style="
      background-color: rgb(0, 0, 0);
      background-size: cover;
      background-position: center;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    ">

    <div class="card mx-4 mx-md-5 shadow-5-strong" style="              
          background: hsla(0, 0%, 100%, 0.1);
          backdrop-filter: blur(5px);
          width: 350px;       
          height: fit-content;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);            
          ">
      <div class="card-body py-5 px-md-5">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-8">
            <h2 class="fw-bold mb-5 text-white">Gofit's Login</h2>
            <div id="backgroundForm">
              <v-form v-model="valid" ref="form" class="center-form">
                <v-text-field dark color="yellow" label="Username" v-model="username" :rules="usernameRules" required></v-text-field>                                    
                <v-text-field dark color="yellow" label="Password" v-model="password" type="password" :rules="passwordRules" required></v-text-field>
                <div>
                  <v-btn class="ma-2 my-5" outlined color="yellow" @click="login" :class="{ disabled: !valid }">Login</v-btn>
                </div>
              </v-form>
            </div>          
          </div>
        </div>
      </div>
    </div>

  </section>

    <!-- Section: Design Block -->
    <v-snackbar v-model="snackbar" :color="color" timeout="1000" bottom>
      {{ error_message }}
    </v-snackbar>  
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",      
      valid: false,
      username: "",
      password: "",
      usernameRules: [(v) => !!v || "Please type your username"],
      passwordRules: [(v) => !!v || "Please type your password"],
    };
  },
  methods: {
    login() {
      var url = this.$api + "/login";
      axios
        .post(url, {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data.data.id_pegawai != null) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("id_pegawai", response.data.data.id_pegawai);
            localStorage.setItem("nama_pegawai", response.data.data.nama_pegawai);
            localStorage.setItem("role_pegawai", response.data.data.role_pegawai);

            this.$router.push("/dashboard");
            this.error_message = response.data.message;
            this.color = "blue";
            this.snackbar = true;
            this.clear();
            this.load = false;
          }else if (response.data.data.id_instruktur != null) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("id_instruktur", response.data.data.id_instruktur);
            localStorage.setItem("nama_instruktur", response.data.data.nama_instruktur);            
                                             
            this.$router.push("/instruktur");
            this.error_message = response.data.message;
            this.color = "blue";
            this.snackbar = true;
            this.clear();
            this.load = false;
          } else {
            localStorage.setItem("id_member", response.data.data.id_member);
            this.$router.push("/member");
          }
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "black";
          this.snackbar = true;
          localStorage.removeItem("token");
          this.load = false;
        });
    },
  },
};
</script>

<style>

.loginBackground {
  background-image: url('../assets/images/wallpaper_1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center; 
}

#divGofit {  
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  z-index: 1;    
}

.center-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center-form v-text-field {
  max-width: 300px;
  margin: 0 auto;
}

.textGofit {
  font-size: 6em;
  font-weight: 500;
  color: #575757;
  letter-spacing: 5px;
  cursor: pointer;
}

.textGofit .textGofit2 {
  transition: 0.5s;
}

.textGofit:hover .textGofit2:nth-child(1) {
  margin-right: 20px;
}

.textGofit:hover .textGofit2:nth-child(2) {
  margin-left: 20px;
}

.textGofit:hover .textGofit2 {
  color: #ffffff;
  text-shadow: 0 0 10px #ffffff,
               0 0 20px #ffffff,
               0 0 40px #ffffff,
               0 0 80px #ffffff,
               0 0 120px #ffffff,
               0 0 160px #ffffff;
}

.box div {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: transparent;
}

.box div:nth-child(1) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 12%;
  left: 42%;
  animation: animate 10s linear infinite;
}
.box div:nth-child(2) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 70%;
  left: 50%;
  animation: animate 7s linear infinite;
}
.box div:nth-child(3) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 17%;
  left: 6%;
  animation: animate 9s linear infinite;
}
.box div:nth-child(4) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 20%;
  left: 60%;
  animation: animate 10s linear infinite;
}
.box div:nth-child(5) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 67%;
  left: 10%;
  animation: animate 6s linear infinite;
}
.box div:nth-child(6) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 80%;
  left: 70%;
  animation: animate 12s linear infinite;
}
.box div:nth-child(7) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 60%;
  left: 80%;
  animation: animate 15s linear infinite;
}
.box div:nth-child(8) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 32%;
  left: 25%;
  animation: animate 16s linear infinite;
}
.box div:nth-child(9) {
  border: 6px solid rgba(255, 255, 255, 0.8);
  top: 90%;
  left: 25%;
  animation: animate 16s linear infinite;
}
.box div:nth-child(10) {
  border: 6px solid rgba(255, 255, 255, 0.8);
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

