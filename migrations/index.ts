import * as migration_20260725_063811_initial from './20260725_063811_initial';
import * as migration_20260725_075103_tambah_legacy_path from './20260725_075103_tambah_legacy_path';
import * as migration_20260727_150103_tambah_koleksi_data_situs from './20260727_150103_tambah_koleksi_data_situs';
import * as migration_20260727_163901_tambah_blok_halaman from './20260727_163901_tambah_blok_halaman';

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
    name: '20260727_163901_tambah_blok_halaman'
  },
];
