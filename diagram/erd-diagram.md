# Mail Service Architecture

```mermaid
erDiagram
    ADMIN_USER ||--o{ MAIL_TEMPLATE : manages
    ADMIN_USER {
        string adminId PK
        string name
        string email
        timestamp lastLogin
    }

    MAIL_TEMPLATE {
        string templateId PK
        string name
        string content
        string status
        timestamp createdAt
        timestamp updatedAt
        string adminId FK
    }

    MAIL_FOLDER ||--|{ MAIL_TEMPLATE : contains
    MAIL_FOLDER {
        string folderId PK
        string name
        string path
        timestamp createdAt
    }

    MAIL_TEMPLATE ||--o{ EMAIL : generates
    EMAIL {
        string emailId PK
        string templateId FK
        string status
        timestamp queuedAt
        timestamp sentAt
        string errorDetails
    }

    EMAIL_QUEUE ||--|{ EMAIL : contains
    EMAIL_QUEUE {
        string queueId PK
        string emailId FK
        int priority
        timestamp scheduledFor
        string status
    }

    MAILING_LIST ||--o{ SUBSCRIBER : includes
    MAILING_LIST {
        string listId PK
        string name
        string description
        boolean isActive
    }

    SUBSCRIBER {
        string subscriberId PK
        string email
        string status
        timestamp subscribedAt
        string listId FK
    }

    ERROR_LOG ||--o{ EMAIL : tracks
    ERROR_LOG {
        string logId PK
        string emailId FK
        string errorType
        string message
        timestamp occurredAt
        boolean isResolved
    }
```

## Component Description

### Admin Actions
- Admins can create, edit, or delete email templates
- Templates are stored in object storage (e.g., AWS S3)

### Mail Service
- **Template Retrieval**: Templates are fetched with caching to reduce storage load
- **Email Preparation**: Templates are customized with user data
- **Queue Management**: Emails are queued for efficient bulk operations
- **Sending**: Handles concurrent email dispatch
- **Delivery Verification**: Performs post-send delivery confirmation

### Scheduling and Subscription
- **Mail Scheduling**: Supports delayed email sending
- **Subscription Management**: Handles mailing list updates

### Error Handling
- Implements retry mechanism for failed sends
- Logs errors for troubleshooting
- Notifies administrators of critical issues

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ EMAIL_SUBSCRIPTION : has
    USER {
        string userId PK
        string email
        string userName
    }
    
    EMAIL_SUBSCRIPTION {
        string subscriptionId PK
        string userId FK
        boolean isActive
        timestamp subscribedAt
    }

    MAIL_TEMPLATE ||--o{ TEMPLATE_VERSION : contains
    MAIL_TEMPLATE {
        string templateId PK
        string templateName
        string subject
    }
    
    TEMPLATE_VERSION {
        string versionId PK
        string templateId FK
        string content
        timestamp createdDate
    }

    MAIL_LOG ||--|| USER : sent_to
    MAIL_LOG ||--|| MAIL_TEMPLATE : uses_template
    MAIL_LOG {
        string mailId PK
        string userId FK
        string templateId FK
        string status
        timestamp sentAt
        string errorDetails
    }

    SCHEDULED_MAIL ||--|| USER : scheduled_for
    SCHEDULED_MAIL ||--|| MAIL_TEMPLATE : uses_template
    SCHEDULED_MAIL {
        string scheduleId PK
        string userId FK
        string templateId FK
        timestamp sendDate
        boolean isSent
    }

    MAIL_QUEUE ||--|| SCHEDULED_MAIL : queues
    MAIL_QUEUE {
        string queueId PK
        string scheduleId FK
        timestamp enqueueTime
        string priority
    }

    ATTACHMENT ||--o{ MAIL_LOG : attached_to
    ATTACHMENT {
        string attachmentId PK
        string mailId FK
        string fileName
        string fileType
        int size
        string storagePath
    }

    BLACKLIST {
        string blacklistId PK
        string email
        timestamp addedDate
        string reason
    }

    USER }o--|| BLACKLIST : may_be_on
    MAIL_LOG }o--|| BLACKLIST : checks_against
    EMAIL_SUBSCRIPTION }o--|| BLACKLIST : checks_against

    ADMIN ||--o{ MAIL_TEMPLATE : manages
    ADMIN {
        string adminId PK
        string adminName
    }

    AUDIT_LOG ||--|| ADMIN : performed_by
    AUDIT_LOG {
        string logId PK
        string adminId FK
        string action
        timestamp actionTime
        string details
    }

    ADMIN }o--|| MAIL_LOG : monitors
    ADMIN }o--|| SCHEDULED_MAIL : manages
```

## Entity Relationships Explained

### Core Components
- **User and Subscription**: Users can have multiple email subscriptions for different mailing lists or types of communications
- **Mail Templates and Versions**: Templates can have multiple versions to track changes over time, allowing for rollback or historical reference
- **Mail Logs**: Logs of sent emails, including status and any errors, linked to users and templates

### Email Management
- **Scheduled Mail**: For emails that need to be sent at a later date, with tracking of whether they've been sent
- **Mail Queue**: To manage the sending of scheduled emails, possibly with priority levels for urgent communications
- **Attachments**: Some emails might have attachments, which are stored separately but linked to specific mail logs

### Security and Administration
- **Blacklist**: To prevent sending emails to addresses that have opted out or have been marked as problematic
- **Admin**: Manages templates, can monitor mail logs, and manage scheduled emails
- **Audit Log**: Keeps track of administrative actions for accountability and security
