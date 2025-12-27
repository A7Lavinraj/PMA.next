CREATE TYPE "public"."user_role" AS ENUM('user', 'driver', 'manager', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255),
	"address" varchar(255),
	"date_of_birth" date,
	"driver_photo" varchar,
	"driving_license_number" varchar,
	"license_expiry_date" varchar,
	"license_photo" varchar,
	"role" "user_role" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
