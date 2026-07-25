import * as migration_20260725_063811_initial from './20260725_063811_initial';

export const migrations = [
  {
    up: migration_20260725_063811_initial.up,
    down: migration_20260725_063811_initial.down,
    name: '20260725_063811_initial'
  },
];
