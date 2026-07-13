ALTER TABLE "build_log" ADD COLUMN "tags" text[] DEFAULT '{}' NOT NULL;
--> statement-breakpoint
ALTER TABLE "learnings" ADD COLUMN "category" text DEFAULT 'general' NOT NULL;
--> statement-breakpoint
ALTER TABLE "learnings" ADD COLUMN "difficulty" text DEFAULT 'beginner' NOT NULL;
--> statement-breakpoint
ALTER TABLE "learnings" ADD COLUMN "resources" jsonb DEFAULT '[]' NOT NULL;
--> statement-breakpoint
ALTER TABLE "roadmap" ADD COLUMN "priority" text DEFAULT 'medium' NOT NULL;
--> statement-breakpoint
ALTER TABLE "roadmap" ADD COLUMN "milestone" text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE "roadmap" ADD COLUMN "target_date" text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE "roadmap" ADD COLUMN "deliverables" text[] DEFAULT '{}' NOT NULL;
--> statement-breakpoint
ALTER TABLE "roadmap" ADD COLUMN "progress" integer DEFAULT 0 NOT NULL;
