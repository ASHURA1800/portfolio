CREATE TABLE "build_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'shipped' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'full-time' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"impact" text[] DEFAULT '{}' NOT NULL,
	"achievements" text[] DEFAULT '{}' NOT NULL,
	"current" boolean DEFAULT false NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"singleton" integer DEFAULT 1 NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"username" text DEFAULT '' NOT NULL,
	"github" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"current_work" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"resume" text DEFAULT '' NOT NULL,
	"linkedin" text DEFAULT '' NOT NULL,
	"twitter" text DEFAULT '' NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"about_journey" text DEFAULT '' NOT NULL,
	"about_current_focus" text DEFAULT '' NOT NULL,
	"about_philosophy" text DEFAULT '' NOT NULL,
	"about_learning" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"contact_note" text DEFAULT '' NOT NULL,
	"skills_note" text DEFAULT '' NOT NULL,
	"blog_intro" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_singleton_unique" UNIQUE("singleton")
);
--> statement-breakpoint
CREATE TABLE "roadmap" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task" text NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"proficiency" integer DEFAULT 0 NOT NULL,
	"years" text DEFAULT '' NOT NULL,
	"context" text DEFAULT '' NOT NULL,
	"icon" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_proficiency_check" CHECK ("skills"."proficiency" >= 0 and "skills"."proficiency" <= 100)
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "problem" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "solution" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "long_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "stack_reasoning" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "screenshots" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "learnings" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "challenges" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "metrics" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" text DEFAULT 'concept' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "year" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "case_study" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_build_log_date" ON "build_log" USING btree ("date" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_experience_order" ON "experience" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_learnings_order" ON "learnings" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_roadmap_order" ON "roadmap" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_skills_order" ON "skills" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "idx_projects_slug" ON "projects" USING btree ("slug");