# Mailpit - Local Email Testing

This project uses [Mailpit](https://github.com/axllent/mailpit) for testing emails in local development environment.

## 🚀 Quick Start

### 1. Start Mailpit

```bash
docker compose up -d
```

### 2. Configure .env Variables

For **local Mailpit**:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM=noreply@localhost
```

For **Mailtrap cloud** (production/staging):

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
MAILTRAP_USERNAME=your_username
MAILTRAP_PASSWORD=your_password
EMAIL_FROM=noreply@example.com
```

### 3. Open Web UI

- **URL:** http://localhost:8025
- Here you will see all emails sent from your application

## 📧 Testing Emails

1. Register a new user or request a password reset
2. Email will **not appear** in a real inbox
3. Open http://localhost:8025 and you will see the email
4. You can test:
   - HTML rendering
   - Responsive design
   - Spam score
   - Links in messages

## 🐳 Docker Commands

```bash
# Start Mailpit
docker compose up -d

# Stop Mailpit
docker compose down

# View logs
docker compose logs -f mailpit

# Restart
docker compose restart mailpit
```

## 🔧 Configuration

Mailpit is configured in `docker-compose.yml`:

- **Port 1025**: SMTP server (for sending emails)
- **Port 8025**: Web UI (for viewing emails)
- **Automatic authentication**: Accepts any credentials
- **Max messages**: 5000

## 💡 Tips

- Emails **don't get deleted automatically** - they remain until you restart the container
- For data persistence, uncomment the `volumes` section in `docker-compose.yml`
- Mailpit is much faster than cloud services like Mailtrap
- Works offline

## 🌍 Mailtrap vs Mailpit

| Feature    | Mailpit (local) | Mailtrap (cloud)        |
| ---------- | --------------- | ----------------------- |
| Speed      | ⚡ Very fast    | 🐌 Depends on internet  |
| Cost       | ✅ Free         | 💰 Has free tier limits |
| Offline    | ✅ Yes          | ❌ No                   |
| Setup      | 🐳 Docker       | 🔑 API keys             |
| Production | ❌ No           | ✅ Yes                  |

**For development:** Use **Mailpit**  
**For production:** Use **Mailtrap** or another SMTP provider (SendGrid, AWS SES, Resend)
