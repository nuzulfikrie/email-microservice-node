CREATE TABLE User (
    userId VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    userName VARCHAR(100)
);

CREATE TABLE EmailSubscription (
    subscriptionId VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    isActive BOOLEAN NOT NULL,
    subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE MailTemplate (
    templateId VARCHAR(36) PRIMARY KEY,
    templateName VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL
);

CREATE TABLE TemplateVersion (
    versionId VARCHAR(36) PRIMARY KEY,
    templateId VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (templateId) REFERENCES MailTemplate(templateId)
);

CREATE TABLE MailLog (
    mailId VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    templateId VARCHAR(36) NOT NULL,
    status VARCHAR(50),
    sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    errorDetails TEXT,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (templateId) REFERENCES MailTemplate(templateId)
);

CREATE TABLE ScheduledMail (
    scheduleId VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    templateId VARCHAR(36) NOT NULL,
    sendDate TIMESTAMP NOT NULL,
    isSent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (templateId) REFERENCES MailTemplate(templateId)
);

CREATE TABLE MailQueue (
    queueId VARCHAR(36) PRIMARY KEY,
    scheduleId VARCHAR(36) NOT NULL,
    enqueueTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(10),
    FOREIGN KEY (scheduleId) REFERENCES ScheduledMail(scheduleId)
);

CREATE TABLE Attachment (
    attachmentId VARCHAR(36) PRIMARY KEY,
    mailId VARCHAR(36) NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    fileType VARCHAR(50),
    size INT,
    storagePath VARCHAR(255),
    FOREIGN KEY (mailId) REFERENCES MailLog(mailId)
);

CREATE TABLE Blacklist (
    blacklistId VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    addedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

CREATE TABLE Admin (
    adminId VARCHAR(36) PRIMARY KEY,
    adminName VARCHAR(100) NOT NULL
);

CREATE TABLE AuditLog (
    logId VARCHAR(36) PRIMARY KEY,
    adminId VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    actionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (adminId) REFERENCES Admin(adminId)
);

-- Indexes for performance enhancement (optional)
CREATE INDEX idx_subscription_user ON EmailSubscription(userId);
CREATE INDEX idx_mail_user ON MailLog(userId);
CREATE INDEX idx_scheduled_user ON ScheduledMail(userId);
CREATE INDEX idx_blacklist_email ON Blacklist(email);