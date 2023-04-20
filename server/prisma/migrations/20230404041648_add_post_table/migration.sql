-- CreateTable
CREATE TABLE `Post`
(
    `id`         INTEGER      NOT NULL AUTO_INCREMENT,
    `title`      VARCHAR(191) NOT NULL,
    `content`    VARCHAR(191) NOT NULL,
    `authorId`   INTEGER      NOT NULL,
    `published`  BOOLEAN      NOT NULL DEFAULT true,
    `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post`
    ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
