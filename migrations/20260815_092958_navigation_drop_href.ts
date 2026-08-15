import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" DROP COLUMN "href";
  ALTER TABLE "navigation_items" DROP COLUMN "href";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" ADD COLUMN "href" varchar;
  ALTER TABLE "navigation_items" ADD COLUMN "href" varchar;`)
}
