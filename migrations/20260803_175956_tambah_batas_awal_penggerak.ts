import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_grid" ADD COLUMN "batas_awal" numeric DEFAULT 10;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD COLUMN "batas_awal" numeric DEFAULT 10;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_grid" DROP COLUMN "batas_awal";
  ALTER TABLE "_pages_v_blocks_team_grid" DROP COLUMN "batas_awal";`)
}
