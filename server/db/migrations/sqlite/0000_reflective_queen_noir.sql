CREATE TABLE `report_change_factors` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `report_change_order_idx` ON `report_change_factors` (`report_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_citations` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`source_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `report_sources`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_citations_target_check" CHECK("report_citations"."target_type" IN ('confidence', 'evidence', 'timeline', 'context', 'rhetoric'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_citations_target_source_uidx` ON `report_citations` (`target_type`,`target_id`,`source_id`);--> statement-breakpoint
CREATE INDEX `report_citations_report_target_idx` ON `report_citations` (`report_id`,`target_type`,`target_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_claim_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`kind` text NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_claim_items_kind_check" CHECK("report_claim_items"."kind" IN ('verifiable', 'interpretation'))
);
--> statement-breakpoint
CREATE INDEX `report_claim_items_order_idx` ON `report_claim_items` (`report_id`,`kind`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`quote` text NOT NULL,
	`author` text NOT NULL,
	`role` text NOT NULL,
	`publisher` text NOT NULL,
	`claim_date` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_claims_report_uidx` ON `report_claims` (`report_id`);--> statement-breakpoint
CREATE TABLE `report_conclusions` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`label` text NOT NULL,
	`summary` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_conclusions_report_uidx` ON `report_conclusions` (`report_id`);--> statement-breakpoint
CREATE TABLE `report_confidence_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`level` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_confidence_level_check" CHECK("report_confidence_items"."level" IN ('high', 'moderate', 'limitation'))
);
--> statement-breakpoint
CREATE INDEX `report_confidence_order_idx` ON `report_confidence_items` (`report_id`,`level`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_context_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `report_context_order_idx` ON `report_context_items` (`report_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_evidence_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`stance` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_evidence_stance_check" CHECK("report_evidence_items"."stance" IN ('support', 'contradict', 'unverified'))
);
--> statement-breakpoint
CREATE INDEX `report_evidence_order_idx` ON `report_evidence_items` (`report_id`,`stance`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_follow_ups` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`suggestion` text NOT NULL,
	`frequency` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_follow_ups_report_uidx` ON `report_follow_ups` (`report_id`);--> statement-breakpoint
CREATE TABLE `report_rhetoric_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `report_rhetoric_order_idx` ON `report_rhetoric_items` (`report_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`publisher` text NOT NULL,
	`url` text NOT NULL,
	`note` text,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_sources_kind_check" CHECK("report_sources"."kind" IN ('primary', 'secondary'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_sources_report_url_uidx` ON `report_sources` (`report_id`,`url`);--> statement-breakpoint
CREATE INDEX `report_sources_order_idx` ON `report_sources` (`report_id`,`kind`,`sort_order`);--> statement-breakpoint
CREATE TABLE `report_timeline_items` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`kind` text NOT NULL,
	`event_date` text,
	`title` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "report_timeline_kind_check" CHECK("report_timeline_items"."kind" IN ('event', 'gap'))
);
--> statement-breakpoint
CREATE INDEX `report_timeline_order_idx` ON `report_timeline_items` (`report_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`language` text DEFAULT 'fr' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`published_at` text,
	`rhetoric_disclaimer` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "reports_language_check" CHECK("reports"."language" IN ('fr', 'en'))
);
