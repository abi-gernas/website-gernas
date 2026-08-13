import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"penggerak_id" integer
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"penggerak_id" integer
  );
  
  ALTER TABLE "articles" ADD COLUMN "author_nama" varchar;
  ALTER TABLE "articles" ADD COLUMN "editor_nama" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_nama" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_editor_nama" varchar;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_penggerak_fk" FOREIGN KEY ("penggerak_id") REFERENCES "public"."penggerak"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_penggerak_fk" FOREIGN KEY ("penggerak_id") REFERENCES "public"."penggerak"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_users_id_idx" ON "articles_rels" USING btree ("users_id");
  CREATE INDEX "articles_rels_penggerak_id_idx" ON "articles_rels" USING btree ("penggerak_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_users_id_idx" ON "_articles_v_rels" USING btree ("users_id");
  CREATE INDEX "_articles_v_rels_penggerak_id_idx" ON "_articles_v_rels" USING btree ("penggerak_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  ALTER TABLE "articles" DROP COLUMN "author_nama";
  ALTER TABLE "articles" DROP COLUMN "editor_nama";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_nama";
  ALTER TABLE "_articles_v" DROP COLUMN "version_editor_nama";`)
}
