DROP INDEX "idx_blogs_slug";--> statement-breakpoint
ALTER TABLE "analytics" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "gradient" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "tags" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "published" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ALTER COLUMN "icon" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ALTER COLUMN "order_index" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "gradient" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tech_stack" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "featured" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "order_index" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonials" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonials" ALTER COLUMN "featured" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonials" ALTER COLUMN "order_index" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "skills" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_certifications_order" ON "certifications" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_certifications_featured" ON "certifications" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_projects_order" ON "projects" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_testimonials_order" ON "testimonials" USING btree ("order_index");