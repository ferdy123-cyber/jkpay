/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  data: any
  profile: any
  message: string
  code: any
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface ApiSubmitKarantina {
  message: string
  status: boolean
  data: [
    {
      karantinaId: string
      noted: string
      tanggalMulai: Date
      tanggalAkhir: Date
      jumlahBibit: number
      ukuranBibit: number
      satuan: string
      kodeStatus: string
      created: Date
      createdBy: string
      updated: Date
      updatedBy: string
      isactive: string
      nomorKarantina: string
      mkolamId: string
      mfarmId: string
      mjenisBibitId: string
    },
  ]
  code: null
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
