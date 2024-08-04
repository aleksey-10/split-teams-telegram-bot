-- DropForeignKey
ALTER TABLE "poll_results" DROP CONSTRAINT "poll_results_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_chat" DROP CONSTRAINT "user_chat_userId_fkey";

-- AddForeignKey
ALTER TABLE "poll_results" ADD CONSTRAINT "poll_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chat" ADD CONSTRAINT "user_chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
