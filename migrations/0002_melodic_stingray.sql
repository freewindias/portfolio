CREATE TABLE "budget_period" (
	"id" text PRIMARY KEY NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_sub_category" (
	"id" text PRIMARY KEY NOT NULL,
	"period_id" text NOT NULL,
	"primary_category" text NOT NULL,
	"name" text NOT NULL,
	"planned_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" text PRIMARY KEY NOT NULL,
	"icon_url" text,
	"role" text NOT NULL,
	"location" text NOT NULL,
	"start_year" text NOT NULL,
	"end_year" text NOT NULL,
	"bullet_points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"client" text,
	"year" text,
	"website" text,
	"image" text,
	"additional_images" jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"period_id" text NOT NULL,
	"sub_category_id" text NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budget_sub_category" ADD CONSTRAINT "budget_sub_category_period_id_budget_period_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."budget_period"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_period_id_budget_period_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."budget_period"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sub_category_id_budget_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."budget_sub_category"("id") ON DELETE cascade ON UPDATE no action;