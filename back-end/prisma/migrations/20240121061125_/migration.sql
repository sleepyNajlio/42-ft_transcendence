/*
  Warnings:

  - The values [REJECTED] on the enum `RelationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');
ALTER TABLE "FriendShip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "FriendShip" ALTER COLUMN "status" TYPE "RelationStatus_new" USING ("status"::text::"RelationStatus_new");
ALTER TYPE "RelationStatus" RENAME TO "RelationStatus_old";
ALTER TYPE "RelationStatus_new" RENAME TO "RelationStatus";
DROP TYPE "RelationStatus_old";
ALTER TABLE "FriendShip" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
