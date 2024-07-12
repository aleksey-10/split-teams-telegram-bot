-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "telegramUserId" INTEGER NOT NULL,
    "username" CHAR(36) NOT NULL,
    "firstName" CHAR(36),
    "lastName" CHAR(36),
    "level" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_chat_id" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pollId" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,

    CONSTRAINT "poll_chat_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_results" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "optionId" INTEGER,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "poll_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegramUserId_key" ON "user"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "poll_chat_id_pollId_key" ON "poll_chat_id"("pollId");

-- CreateIndex
CREATE INDEX "userId" ON "poll_results"("userId");

-- AddForeignKey
ALTER TABLE "poll_results" ADD CONSTRAINT "poll_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_results" ADD CONSTRAINT "poll_results_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll_chat_id"("pollId") ON DELETE RESTRICT ON UPDATE CASCADE;
