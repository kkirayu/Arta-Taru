# Deploy Toko Arta Taru to Vercel (Hobby) + TiDB Cloud

> **⚠️ Important**: Vercel Hobby plan **prohibits commercial use** per their ToS. This deployment is for demo/testing only. For production commercial use, upgrade to Vercel Pro or use another host (Railway, Fly.io, DigitalOcean App Platform, etc.).

---

## Prerequisites

1. **GitHub account** with the repository pushed
2. **Vercel account** (Hobby plan)
3. **TiDB Cloud account** (Starter tier, Singapore region)
4. **S3-compatible storage** (AWS S3, Cloudflare R2, MinIO, etc.) for product images & payment proofs

---

## 1. TiDB Cloud Setup

1. Create a TiDB Cloud Starter cluster in **Singapore (ap-southeast-1)**
2. Note down connection details:
   - Host: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
   - Port: `4000`
   - Username: `root` (or your user)
   - Password: (from cluster settings)
   - Database: `arta_taru`
   - **SSL CA**: Download the CA cert from TiDB Cloud console
3. Enable **Public Access** for your IP (or use 0.0.0.0/0 for Vercel)
4. Set `wait_timeout` and `interactive_timeout` to 300+ seconds if possible (TiDB defaults to 340s idle)

---

## 2. S3 Storage Setup

Create **two buckets** (or use prefixes in one bucket):
- **Public bucket** (`arta-taru-public`): product images, served via CDN
- **Private bucket** (`arta-taru-private`): payment proofs, accessed via signed URLs

**IAM Policy** (least privilege):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::arta-taru-public/*",
        "arn:aws:s3:::arta-taru-private/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::arta-taru-public",
        "arn:aws:s3:::arta-taru-private"
      ]
    }
  ]
}
```

---

## 3. Vercel Project Setup

### Create Project
1. Go to Vercel Dashboard → **Add New Project**
2. Import from GitHub: select `Arta-Taru` repo
3. Framework Preset: **Other** (we use Docker)
4. Root Directory: `.` (repository root)
5. Build Command: `docker build -t artataru .` (handled by vercel.json)
6. Output Directory: (leave empty)
7. **Environment Variables** (see section 4)

### Configure Cron
Vercel Hobby allows **1 cron job per day**. Our app uses:
- **Path**: `/api/cron/tick`
- **Schedule**: `0 2 * * *` (2 AM UTC = 9 AM WIB)
- **Secret**: `CRON_SECRET` (must match `.env`)

---

## 4. Environment Variables (Vercel Dashboard → Settings → Environment Variables)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | `production` | `production` |
| `APP_DEBUG` | Disable debug | `false` |
| `APP_URL` | Production URL | `https://artataru.vercel.app` |
| `APP_KEY` | Run `php artisan key:generate --show` | `base64:...` |
| `CRON_SECRET` | Random 32+ char string for cron auth | `super-secret-cron-token-...` |
| `DB_CONNECTION` | `mysql` | `mysql` |
| `DB_HOST` | TiDB host | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| `DB_PORT` | `4000` | `4000` |
| `DB_DATABASE` | `arta_taru` | `arta_taru` |
| `DB_USERNAME` | TiDB username | `root` |
| `DB_PASSWORD` | TiDB password | `***` |
| `MYSQL_ATTR_SSL_CA` | **Base64-encoded** CA cert content | `LS0tLS1CRUdJTi...` |
| `SESSION_DRIVER` | `database` | `database` |
| `CACHE_STORE` | `database` | `database` |
| `QUEUE_CONNECTION` | `database` | `database` |
| `FILESYSTEM_DISK` | `s3` | `s3` |
| `PRODUCT_DISK` | `s3` | `s3` |
| `PROOF_DISK` | `s3_private` | `s3_private` |
| `AWS_ACCESS_KEY_ID` | S3 access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | `***` |
| `AWS_DEFAULT_REGION` | `ap-southeast-1` | `ap-southeast-1` |
| `AWS_BUCKET` | Public bucket name | `arta-taru-public` |
| `AWS_URL` | Public bucket URL (CDN) | `https://cdn.artataru.com` |
| `AWS_PRIVATE_BUCKET` | Private bucket name | `arta-taru-private` |
| `MAIL_MAILER` | `smtp` (or `log` for testing) | `smtp` |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | `587` | `587` |
| `MAIL_USERNAME` | SMTP user | `noreply@artataru.com` |
| `MAIL_PASSWORD` | SMTP password | `***` |
| `MAIL_ENCRYPTION` | `tls` | `tls` |
| `MAIL_FROM_ADDRESS` | `noreply@artataru.com` | `noreply@artataru.com` |
| `MAIL_FROM_NAME` | `Toko Arta Taru` | `Toko Arta Taru` |
| `VITE_APP_NAME` | `Toko Arta Taru` | `Toko Arta Taru` |

### SSL CA Certificate
1. Download `ca.pem` from TiDB Cloud
2. Encode to base64: `cat ca.pem | base64 -w 0`
3. Paste as `MYSQL_ATTR_SSL_CA` value in Vercel

---

## 5. Database Migration

After first deploy, run migrations:

```bash
# Option A: Vercel CLI
vercel env pull .env.production.local
docker run --rm -v $(pwd):/app -w /app php:8.3-cli php artisan migrate --force

# Option B: GitHub Actions (add to deploy.yml)
# - name: Run migrations
#   run: vercel exec -- php artisan migrate --force
```

---

## 6. Storage Link (for local dev only)

On Vercel, `public/storage` is not used (S3). For local:
```bash
php artisan storage:link
```

---

## 7. Cron Job (External Alternative)

Since Vercel Hobby only allows 1 cron/day, consider **cron-job.org** (free) as backup:

1. Create account at cron-job.org
2. Add job:
   - URL: `https://your-app.vercel.app/api/cron/tick?token=YOUR_CRON_SECRET`
   - Schedule: Every 5 minutes (or your preference)
   - Method: GET
   - Timeout: 30 seconds

---

## 8. Monitoring & Limits

| Resource | Vercel Hobby | TiDB Starter |
|----------|--------------|--------------|
| CPU Hours | 4,000 hrs/mo | N/A |
| Bandwidth | 100 GB/mo | 50 GB/mo |
| Storage | 1 GB (ephemeral) | 5 GiB |
| Request Body | 4.5 MB | N/A |
| Function Timeout | 60s (configurable to 300s) | N/A |
| DB Connections | N/A | 400 |
| DB RU | N/A | 50M/mo |

**Tips to stay within limits:**
- Daily `daily_stats` aggregation keeps dashboard queries light
- Client-side image compression (≤4 MB) avoids 4.5 MB body limit
- Non-persistent PDO connections (TiDB drops idle at 30 min)
- `DB::retry()` helper for TiDB Error 9007

---

## 9. Troubleshooting

### "MySQL server has gone away" / Error 9007
- App uses `DbRetry` helper for automatic retry
- Ensure `MYSQL_ATTR_SSL_CA` is set correctly
- Check TiDB Cloud connection limits

### 413 Request Entity Too Large
- Frontend compresses images to ≤4 MB
- Verify `upload_max_filesize = 4M` in `docker/php.ini`

### Cron not running
- Verify `CRON_SECRET` matches in `.env` and Vercel
- Check Vercel Function logs for `/api/cron/tick`
- Add cron-job.org as backup

### Images not loading
- Check `AWS_URL` / `AWS_BUCKET` config
- Verify S3 bucket CORS policy allows your domain
- Private proofs: check signed URL generation in `Admin/OrderController@downloadProof`

---

## 10. Production Checklist

- [ ] Upgrade to Vercel Pro for commercial use
- [ ] Configure custom domain (CNAME → `cname.vercel-dns.com`)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up uptime monitoring (UptimeRobot, Better Uptime)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation (Datadog, Logtail, or Vercel Logs)
- [ ] Load test with k6 or Artillery
- [ ] Document rollback procedure

---

## Rollback

```bash
# Vercel CLI rollback
vercel rollback <deployment-url> --token=$VERCEL_TOKEN

# Or via dashboard: Deployments → three dots → Promote to Production
```

---

## Support

- **Laravel docs**: https://laravel.com/docs
- **Inertia React docs**: https://inertiajs.com/react
- **Vercel Docker docs**: https://vercel.com/docs/concepts/deployments/docker
- **TiDB Cloud docs**: https://docs.pingcap.com/tidbcloud