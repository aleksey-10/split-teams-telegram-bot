-- DropForeignKey
ALTER TABLE "poll_results" DROP CONSTRAINT "poll_results_pollId_fkey";

-- CreateTable
CREATE TABLE "user_chat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatId" BIGINT NOT NULL,

    CONSTRAINT "user_chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "poll_results" ADD CONSTRAINT "poll_results_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll_chat_id"("pollId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chat" ADD CONSTRAINT "user_chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
