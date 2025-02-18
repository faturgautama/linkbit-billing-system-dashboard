import { HttpBaseResponse } from "../../http/http-request.model"

export namespace BerandaModel {
    export interface IJadwalDokter {
        id_jadwal_dokter: string
        nama: string
        jadwal: string
    }

    export interface IPenyakitPopular {
        nama_penyakit: string
        jml_pasien_terdiagnosa: string
    }

    export interface IPendapatan {
        tanggal: string
        total_pendapatan: number
    }

    export interface IBeranda {
        jadwal_dokter: IJadwalDokter[]
        pasien_terlayani_today: string
        total_pasien: string
        dokter_praktek_today: string
        tindakan_medis_today: string
        penyakit_popular: IPenyakitPopular[]
        pendapatan: IPendapatan[]
    }

    export class GetAllDashboard implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBeranda
    }
}