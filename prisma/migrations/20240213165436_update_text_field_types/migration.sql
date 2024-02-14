/*
  Warnings:

  - You are about to alter the column `refresh_token` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to alter the column `access_token` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to alter the column `id_token` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to alter the column `bio` on the `users` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[accounts] ALTER COLUMN [refresh_token] TEXT NULL;
ALTER TABLE [dbo].[accounts] ALTER COLUMN [access_token] TEXT NULL;
ALTER TABLE [dbo].[accounts] ALTER COLUMN [id_token] TEXT NULL;

-- AlterTable
ALTER TABLE [dbo].[users] ALTER COLUMN [bio] TEXT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
