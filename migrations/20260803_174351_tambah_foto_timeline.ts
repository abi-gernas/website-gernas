import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_entries" ADD COLUMN "foto_id" integer;
  ALTER TABLE "_pages_v_blocks_timeline_entries" ADD COLUMN "foto_id" integer;
  ALTER TABLE "pages_blocks_timeline_entries" ADD CONSTRAINT "pages_blocks_timeline_entries_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_entries" ADD CONSTRAINT "_pages_v_blocks_timeline_entries_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_timeline_entries_foto_idx" ON "pages_blocks_timeline_entries" USING btree ("foto_id");
  CREATE INDEX "_pages_v_blocks_timeline_entries_foto_idx" ON "_pages_v_blocks_timeline_entries" USING btree ("foto_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_entries" DROP CONSTRAINT "pages_blocks_timeline_entries_foto_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_timeline_entries" DROP CONSTRAINT "_pages_v_blocks_timeline_entries_foto_id_media_id_fk";
  
  DROP INDEX "pages_blocks_timeline_entries_foto_idx";
  DROP INDEX "_pages_v_blocks_timeline_entries_foto_idx";
  ALTER TABLE "pages_blocks_timeline_entries" DROP COLUMN "foto_id";
  ALTER TABLE "_pages_v_blocks_timeline_entries" DROP COLUMN "foto_id";`)
}
