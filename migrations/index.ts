import * as migration_20260725_063811_initial from './20260725_063811_initial';
import * as migration_20260725_075103_tambah_legacy_path from './20260725_075103_tambah_legacy_path';
import * as migration_20260727_150103_tambah_koleksi_data_situs from './20260727_150103_tambah_koleksi_data_situs';
import * as migration_20260727_163901_tambah_blok_halaman from './20260727_163901_tambah_blok_halaman';
import * as migration_20260730_091756_tambah_localization from './20260730_091756_tambah_localization';
import * as migration_20260730_161555_tambah_localized_tombol from './20260730_161555_tambah_localized_tombol';
import * as migration_20260730_164524_bilingual_penuh from './20260730_164524_bilingual_penuh';
import * as migration_20260803_044210_tambah_blok_kegiatan from './20260803_044210_tambah_blok_kegiatan';
import * as migration_20260803_061935_tambah_blok_program_intensif from './20260803_061935_tambah_blok_program_intensif';
import * as migration_20260803_174351_tambah_foto_timeline from './20260803_174351_tambah_foto_timeline';
import * as migration_20260803_175420_tambah_blok_visi_misi from './20260803_175420_tambah_blok_visi_misi';
import * as migration_20260803_175956_tambah_batas_awal_penggerak from './20260803_175956_tambah_batas_awal_penggerak';
import * as migration_20260813_024849 from './20260813_024849';
import * as migration_20260815_090623_navigation from './20260815_090623_navigation';
import * as migration_20260815_091655_navigation_hidden from './20260815_091655_navigation_hidden';
import * as migration_20260815_092907_navigation_link_type from './20260815_092907_navigation_link_type';
import * as migration_20260815_092958_navigation_drop_href from './20260815_092958_navigation_drop_href';

export const migrations = [
  {
    up: migration_20260725_063811_initial.up,
    down: migration_20260725_063811_initial.down,
    name: '20260725_063811_initial',
  },
  {
    up: migration_20260725_075103_tambah_legacy_path.up,
    down: migration_20260725_075103_tambah_legacy_path.down,
    name: '20260725_075103_tambah_legacy_path',
  },
  {
    up: migration_20260727_150103_tambah_koleksi_data_situs.up,
    down: migration_20260727_150103_tambah_koleksi_data_situs.down,
    name: '20260727_150103_tambah_koleksi_data_situs',
  },
  {
    up: migration_20260727_163901_tambah_blok_halaman.up,
    down: migration_20260727_163901_tambah_blok_halaman.down,
    name: '20260727_163901_tambah_blok_halaman',
  },
  {
    up: migration_20260730_091756_tambah_localization.up,
    down: migration_20260730_091756_tambah_localization.down,
    name: '20260730_091756_tambah_localization',
  },
  {
    up: migration_20260730_161555_tambah_localized_tombol.up,
    down: migration_20260730_161555_tambah_localized_tombol.down,
    name: '20260730_161555_tambah_localized_tombol',
  },
  {
    up: migration_20260730_164524_bilingual_penuh.up,
    down: migration_20260730_164524_bilingual_penuh.down,
    name: '20260730_164524_bilingual_penuh',
  },
  {
    up: migration_20260803_044210_tambah_blok_kegiatan.up,
    down: migration_20260803_044210_tambah_blok_kegiatan.down,
    name: '20260803_044210_tambah_blok_kegiatan',
  },
  {
    up: migration_20260803_061935_tambah_blok_program_intensif.up,
    down: migration_20260803_061935_tambah_blok_program_intensif.down,
    name: '20260803_061935_tambah_blok_program_intensif',
  },
  {
    up: migration_20260803_174351_tambah_foto_timeline.up,
    down: migration_20260803_174351_tambah_foto_timeline.down,
    name: '20260803_174351_tambah_foto_timeline',
  },
  {
    up: migration_20260803_175420_tambah_blok_visi_misi.up,
    down: migration_20260803_175420_tambah_blok_visi_misi.down,
    name: '20260803_175420_tambah_blok_visi_misi',
  },
  {
    up: migration_20260803_175956_tambah_batas_awal_penggerak.up,
    down: migration_20260803_175956_tambah_batas_awal_penggerak.down,
    name: '20260803_175956_tambah_batas_awal_penggerak',
  },
  {
    up: migration_20260813_024849.up,
    down: migration_20260813_024849.down,
    name: '20260813_024849',
  },
  {
    up: migration_20260815_090623_navigation.up,
    down: migration_20260815_090623_navigation.down,
    name: '20260815_090623_navigation',
  },
  {
    up: migration_20260815_091655_navigation_hidden.up,
    down: migration_20260815_091655_navigation_hidden.down,
    name: '20260815_091655_navigation_hidden',
  },
  {
    up: migration_20260815_092907_navigation_link_type.up,
    down: migration_20260815_092907_navigation_link_type.down,
    name: '20260815_092907_navigation_link_type',
  },
  {
    up: migration_20260815_092958_navigation_drop_href.up,
    down: migration_20260815_092958_navigation_drop_href.down,
    name: '20260815_092958_navigation_drop_href'
  },
];
