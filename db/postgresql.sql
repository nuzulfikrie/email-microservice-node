CREATE TABLE "User" (
    "userId" UUID PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "userName" VARCHAR(100)
);

CREATE TABLE "EmailSubscription" (
    "subscriptionId" UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "subscribedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("userId")
);

CREATE TABLE "MailTemplate" (
    "templateId" UUID PRIMARY KEY,
    "templateName" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(255) NOT NULL
);

CREATE TABLE "TemplateVersion" (
    "versionId" UUID PRIMARY KEY,
    "templateId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("templateId") REFERENCES "MailTemplate"("templateId")
);

CREATE TABLE "MailLog" (
    "mailId" UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "status" VARCHAR(50),
    "sentAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "errorDetails" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"("userId"),
    FOREIGN KEY ("templateId") REFERENCES "MailTemplate"("templateId")
);

CREATE TABLE "ScheduledMail" (
    "scheduleId" UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "sendDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "isSent" BOOLEAN DEFAULT FALSE,
    FOREIGN KEY ("userId") REFERENCES "User"("userId"),
    FOREIGN KEY ("templateId") REFERENCES "MailTemplate"("templateId")
);

CREATE TABLE "MailQueue" (
    "queueId" UUID PRIMARY KEY,
    "scheduleId" UUID NOT NULL,
    "enqueueTime" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "priority" VARCHAR(10),
    FOREIGN KEY ("scheduleId") REFERENCES "ScheduledMail"("scheduleId")
);

CREATE TABLE "Attachment" (
    "attachmentId" UUID PRIMARY KEY,
    "mailId" UUID NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(50),
    "size" INTEGER,
    "storagePath" VARCHAR(255),
    FOREIGN KEY ("mailId") REFERENCES "MailLog"("mailId")
);

CREATE TABLE "Blacklist" (
    "blacklistId" UUID PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "addedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT
);

CREATE TABLE "Admin" (
    "adminId" UUID PRIMARY KEY,
    "adminName" VARCHAR(100) NOT NULL
);

CREATE TABLE "AuditLog" (
    "logId" UUID PRIMARY KEY,
    "adminId" UUID,
    "action" VARCHAR(100) NOT NULL,
    "actionTime" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    FOREIGN KEY ("adminId") REFERENCES "Admin"("adminId")
);

-- Indexes for performance enhancement (optional)
CREATE INDEX "idx_subscription_user" ON "EmailSubscription"("userId");
CREATE INDEX "idx_mail_user" ON "MailLog"("userId");
CREATE INDEX "idx_scheduled_user" ON "ScheduledMail"("userId");
CREATE INDEX "idx_blacklist_email" ON "Blacklist"("email");