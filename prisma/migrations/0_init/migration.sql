-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."cars" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model_name" VARCHAR(100) NOT NULL,
    "version_name" VARCHAR(80),
    "gear_count" INTEGER,
    "seats" INTEGER,
    "year" INTEGER,
    "engine" VARCHAR(20),
    "color" VARCHAR(50),
    "image_url" TEXT DEFAULT '',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "r8_locality" VARCHAR(120),

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."models" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "brand" VARCHAR(255),

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_description" (
    "id" SERIAL NOT NULL,
    "all_around_description" TEXT NOT NULL,
    "backend" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "testing" VARCHAR(80) NOT NULL,
    "url_repository" VARCHAR(70),
    "name" VARCHAR(70),
    "devops" TEXT NOT NULL,
    "swagger_documentation_url" VARCHAR(80),

    CONSTRAINT "project_description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rn8_localities" (
    "id" SERIAL NOT NULL,
    "province" VARCHAR(80) NOT NULL,
    "locality_name" VARCHAR(120) NOT NULL,
    "normalized_name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rn8_localities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."versions" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "model_name" VARCHAR(100) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "brand" VARCHAR(255),

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "public"."models"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "project_description_all_around_description_key" ON "public"."project_description"("all_around_description" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "project_description_swagger_documentation_url_key" ON "public"."project_description"("swagger_documentation_url" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "project_description_url_repository_key" ON "public"."project_description"("url_repository" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "rn8_localities_locality_name_key" ON "public"."rn8_localities"("locality_name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "rn8_localities_province_normalized_name_key" ON "public"."rn8_localities"("province" ASC, "normalized_name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "versions_unique_per_model_id" ON "public"."versions"("model_id" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "versions_unique_per_model_name" ON "public"."versions"("model_name" ASC, "name" ASC);

-- AddForeignKey
ALTER TABLE "public"."cars" ADD CONSTRAINT "cars_model_name_fk" FOREIGN KEY ("model_name") REFERENCES "public"."models"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cars" ADD CONSTRAINT "cars_model_version_name" FOREIGN KEY ("model_name", "version_name") REFERENCES "public"."versions"("model_name", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cars" ADD CONSTRAINT "cars_r8_locality_fk" FOREIGN KEY ("r8_locality") REFERENCES "public"."rn8_localities"("locality_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."versions" ADD CONSTRAINT "versions_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."versions" ADD CONSTRAINT "versions_model_name_fkey" FOREIGN KEY ("model_name") REFERENCES "public"."models"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

