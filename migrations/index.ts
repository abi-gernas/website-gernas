import * as migration_20260725_063811_initial from './20260725_063811_initial';
import * as migration_20260725_075103_tambah_legacy_path from './20260725_075103_tambah_legacy_path';

export const migrations = [
  {
    up: migration_20260725_063811_initial.up,
    down: migration_20260725_063811_initial.down,
    name: '20260725_063811_initial',
  },
  {
    up: migration_20260725_075103_tambah_legacy_path.up,
    down: migration_20260725_075103_tambah_legacy_path.down,
    name: '20260725_075103_tambah_legacy_path'
  },
];
