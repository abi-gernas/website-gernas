import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ulasan_status" AS ENUM('menunggu', 'disetujui', 'ditolak');
  CREATE TYPE "public"."enum_ulasan_locale" AS ENUM('id', 'en');
  CREATE TABLE "ulasan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"produk_ref_id" integer NOT NULL,
  	"nama" varchar NOT NULL,
  	"rating" numeric NOT NULL,
  	"komentar" varchar,
  	"status" "enum_ulasan_status" DEFAULT 'menunggu' NOT NULL,
  	"locale" "enum_ulasan_locale",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "produk" ADD COLUMN "penulis" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ulasan_id" integer;
  ALTER TABLE "ulasan" ADD CONSTRAINT "ulasan_produk_ref_id_produk_id_fk" FOREIGN KEY ("produk_ref_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "ulasan_produk_ref_idx" ON "ulasan" USING btree ("produk_ref_id");
  CREATE INDEX "ulasan_updated_at_idx" ON "ulasan" USING btree ("updated_at");
  CREATE INDEX "ulasan_created_at_idx" ON "ulasan" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ulasan_fk" FOREIGN KEY ("ulasan_id") REFERENCES "public"."ulasan"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_ulasan_id_idx" ON "payload_locked_documents_rels" USING btree ("ulasan_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ulasan" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ulasan" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ulasan_fk";
  
  DROP INDEX "payload_locked_documents_rels_ulasan_id_idx";
  ALTER TABLE "produk" DROP COLUMN "penulis";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ulasan_id";
  DROP TYPE "public"."enum_ulasan_status";
  DROP TYPE "public"."enum_ulasan_locale";`)
}
