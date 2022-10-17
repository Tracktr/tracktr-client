-- CreateTable
CREATE TABLE `Languages` (
    `iso_639_1` VARCHAR(191) NOT NULL,
    `englishName` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Languages_iso_639_1_key`(`iso_639_1`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
