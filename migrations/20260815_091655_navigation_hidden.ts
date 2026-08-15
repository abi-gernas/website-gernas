import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "navigation_items" ADD COLUMN "hidden" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" DROP COLUMN "hidden";
  ALTER TABLE "navigation_items" DROP COLUMN "hidden";`)
}
