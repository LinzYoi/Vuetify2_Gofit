import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.use(VueRouter)
function importViewComponent(path) {
  return () => import(`../views/${path}.vue`)
}
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: importViewComponent('LoginPage'),
    },
    {
      path: '/',
        component: importViewComponent('DashboardLayout'),
        children: [
            //Dashboard Pegawai
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {title : 'dashboard'},
                component: importViewComponent('DashboardPegawaiPage'),
            },
            //jadwal umum
            {
              path: '/jadwal',
              name: 'jadwal',
              meta: {title : 'jadwal'},
              component: importViewComponent('JadwalInstrukturPage'),
            },
            //jadwal harian
            {
              path: '/jadwal-harian',
              name: 'jadwal-harian',
              meta: {title : 'jadwal-harian'},
              component: importViewComponent('JadwalHarianPage'),
            },
            //izin instruktur
            {
              path: '/izin-instruktur',
              name: 'izin-instruktur',
              meta: {title : 'izin-instruktur'},
              component: importViewComponent('IzinInstrukturPage'),
            },
            //laporan aktivitas aktivitas gym bulanan
            {
              path: '/laporan-aktivitas-gym-bulanan',
              name: 'laporan-aktivitas-gym-bulanan',
              meta: {title : 'laporan-aktivitas-gym-bulanan'},
              component: importViewComponent('LaporanAktivitasGymBulananPage'),
            },
            //laporan aktivitas aktivitas kelas bulanan
            {
              path: '/laporan-aktivitas-kelas-bulanan',
              name: 'laporan-aktivitas-kelas-bulanan',
              meta: {title : 'laporan-aktivitas-kelas-bulanan'},
              component: importViewComponent('LaporanAktivitasKelasBulananPage'),
            },
            //laporan kinerja instruktur bulanan
            {
              path: '/laporan-kinerja-instruktur-bulanan',
              name: 'laporan-kinerja-instruktur-bulanan',
              meta: {title : 'laporan-kinerja-instruktur-bulanan'},
              component: importViewComponent('LaporanKinerjaInstrukturBulananPage'),
            },
            //laporan pendapatan per bulan dalam tahun tertentu
            {
              path: '/laporan-pendapatan-per-bulan-dalam-tahun-tertentu',
              name: 'laporan-pendapatan-per-bulan-dalam-tahun-tertentu',
              meta: {title : 'laporan-pendapatan-per-bulan-dalam-tahun-tertentu'},
              component: importViewComponent('LaporanPendapatanPerBulanDalamTahunTertentuPage'),
            },
            //instruktur
            {
              path: '/instruktur',
              name: 'instruktur',
              meta: {title : 'instruktur'},
              component: importViewComponent('InstrukturPage'),
            },
            //member
            {
              path: '/member',
              name: 'member',
              meta: {title : 'member'},
              component: importViewComponent('MemberPage'),
            },
            //pegawai
            {
              path: '/pegawai',
              name: 'pegawai',
              meta: {title : 'pegawai'},
              component: importViewComponent('PegawaiPage'),
            },
            //promo
            {
              path: '/promo',
              name: 'promo',
              meta: {title : 'promo'},
              component: importViewComponent('PromoPage'),
            },
            //transaksi aktivasi
            {
              path: '/transaksi-aktivasi',
              name: 'transaksi-aktivasi',
              meta: {title : 'transaksi-aktivasi'},
              component: importViewComponent('TransaksiAktivasiPage'),
            },
            //transaksi deposit uang
            {
              path: '/transaksi-deposit-uang',
              name: 'transaksi-deposit-uang',
              meta: {title : 'transaksi-deposit-uang'},
              component: importViewComponent('TransaksiDepositUangPage'),
            },
            //transaksi deposit kelas
            {
              path: '/transaksi-deposit-kelas',
              name: 'transaksi-deposit-kelas',
              meta: {title : 'transaksi-deposit-kelas'},
              component: importViewComponent('TransaksiDepositKelasPage'),
            },
            // reset deposit kelas per hari ini
            {
              path: '/reset-deposit-kelas',
              name: 'reset-deposit-kelas',
              meta: {title : 'reset-deposit-kelas'},
              component: importViewComponent('ResetDepositKelasPage'),
            },
            //presensi member di kasir
            {
              path: '/presensi-member-gym',
              name: 'presensi-member-gym',
              meta: {title : 'presensi-member-gym'},
              component: importViewComponent('PresensiMemberGymPage'),
            },
            {
              path: '/presensi-member-kelas',
              name: 'presensi-member-kelas',
              meta: {title : 'presensi-member-kelas'},
              component: importViewComponent('PresensiMemberKelasPage'),
            },
            
          ]
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})

export default router
