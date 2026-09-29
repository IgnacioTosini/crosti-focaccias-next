CREATE TABLE "PageContent" (
    "page" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("page")
);
