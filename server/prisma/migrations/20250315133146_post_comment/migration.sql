-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "comment" JSONB,
ADD COLUMN     "likes" BIGINT,
ADD COLUMN     "views" BIGINT;
