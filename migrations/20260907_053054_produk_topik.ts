import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produk_topik" AS ENUM('geometri', 'bilangan-cacah', 'pecahan', 'bilangan-bulat', 'statistika', 'pengukuran');
  ALTER TABLE "produk" ADD COLUMN "topik" "enum_produk_topik" DEFAULT 'geometri' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "produk" DROP COLUMN "topik";
  DROP TYPE "public"."enum_produk_topik";`)
}
