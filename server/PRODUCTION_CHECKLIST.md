# Production Deployment Checklist

## 🚀 Pre-Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.production.template` to `.env.production`
- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `JWT_SECRET` (32+ characters)
- [ ] Set production `DATABASE_URL`
- [ ] Configure `REDIS_URL` for production
- [ ] Set up production SMTP settings
- [ ] Configure `CORS_ORIGIN` with actual domain(s)
- [ ] Remove `OTP_TEST_EMAIL` from production environment
- [ ] Set `TRUST_PROXY=true` if behind load balancer
- [ ] Configure appropriate `LOG_LEVEL` (info or warn)

### Security Configuration
- [ ] JWT secret is cryptographically secure
- [ ] Database credentials are secure
- [ ] Redis credentials are secure
- [ ] SMTP credentials are secure
- [ ] CORS origins are restricted to production domains
- [ ] Rate limiting is configured appropriately
- [ ] File upload limits are set
- [ ] Security headers are enabled (Helmet)

### Database Setup
- [ ] Production database is created
- [ ] Database migrations are up to date
- [ ] Database backups are configured
- [ ] Database connection pooling is optimized
- [ ] Database monitoring is set up

### Infrastructure
- [ ] Server/container resources are adequate
- [ ] Load balancer is configured (if applicable)
- [ ] SSL/TLS certificates are installed
- [ ] Firewall rules are configured
- [ ] Monitoring and alerting are set up
- [ ] Log aggregation is configured

## 🔧 Deployment Steps

### 1. Build and Test
```bash
# Run the deployment script
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

### 2. Process Management (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set up PM2 startup script
pm2 startup
```

### 3. Docker Deployment (Alternative)
```bash
# Build the Docker image
docker build -t uimp-backend .

# Run the container
docker run -d \
  --name uimp-backend \
  --env-file .env.production \
  -p 3001:3001 \
  --restart unless-stopped \
  uimp-backend
```

### 4. Nginx Configuration (Reverse Proxy)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

## 📊 Post-Deployment Verification

### Health Checks
- [ ] Application starts successfully
- [ ] Health endpoint responds: `curl https://yourdomain.com/health`
- [ ] Database connection is working
- [ ] Redis connection is working
- [ ] Email service is working
- [ ] File uploads work (if applicable)

### API Testing
- [ ] Authentication endpoints work
- [ ] OTP password reset flow works
- [ ] Rate limiting is functioning
- [ ] CORS is properly configured
- [ ] Error handling is working

### Performance Testing
- [ ] Response times are acceptable
- [ ] Memory usage is stable
- [ ] CPU usage is reasonable
- [ ] Database queries are optimized
- [ ] Redis caching is working

### Security Testing
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] Rate limiting prevents abuse
- [ ] Input validation is working
- [ ] Authentication is secure
- [ ] No sensitive data in logs

## 🔍 Monitoring Setup

### Application Monitoring
- [ ] Set up application performance monitoring (APM)
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up metrics collection

### Infrastructure Monitoring
- [ ] Server resource monitoring
- [ ] Database monitoring
- [ ] Redis monitoring
- [ ] Network monitoring
- [ ] SSL certificate monitoring

### Alerting
- [ ] High error rate alerts
- [ ] Performance degradation alerts
- [ ] Resource usage alerts
- [ ] Security incident alerts
- [ ] Service downtime alerts

## 🛡️ Security Hardening

### Server Security
- [ ] Keep OS and packages updated
- [ ] Configure firewall rules
- [ ] Disable unnecessary services
- [ ] Set up intrusion detection
- [ ] Configure fail2ban (if applicable)

### Application Security
- [ ] Regular dependency updates
- [ ] Security vulnerability scanning
- [ ] Code quality checks
- [ ] Penetration testing
- [ ] Security audit logs

### Data Security
- [ ] Database encryption at rest
- [ ] Backup encryption
- [ ] Secure data transmission
- [ ] Data retention policies
- [ ] GDPR compliance (if applicable)

## 📋 Maintenance Tasks

### Regular Tasks
- [ ] Monitor application logs
- [ ] Check system resources
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Database maintenance

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Check backup integrity
- [ ] Security scan results
- [ ] Update documentation
- [ ] Team status review

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] Disaster recovery testing
- [ ] Documentation updates

## 🚨 Incident Response

### Preparation
- [ ] Incident response plan documented
- [ ] Contact information updated
- [ ] Escalation procedures defined
- [ ] Backup and recovery procedures tested
- [ ] Communication channels established

### Response Procedures
1. **Immediate Response**
   - Assess the situation
   - Contain the incident
   - Notify stakeholders
   - Document actions taken

2. **Investigation**
   - Gather evidence
   - Analyze root cause
   - Implement fixes
   - Test solutions

3. **Recovery**
   - Restore services
   - Verify functionality
   - Monitor for issues
   - Update documentation

4. **Post-Incident**
   - Conduct post-mortem
   - Update procedures
   - Implement improvements
   - Share learnings

## 📚 Documentation

### Required Documentation
- [ ] API documentation
- [ ] Deployment procedures
- [ ] Configuration management
- [ ] Troubleshooting guides
- [ ] Security procedures

### Keep Updated
- [ ] Environment configurations
- [ ] Dependency versions
- [ ] Security policies
- [ ] Incident procedures
- [ ] Contact information

## 🎯 Performance Optimization

### Application Level
- [ ] Database query optimization
- [ ] Caching strategy implementation
- [ ] Code profiling and optimization
- [ ] Memory leak detection
- [ ] Connection pooling

### Infrastructure Level
- [ ] Load balancing configuration
- [ ] CDN setup (if applicable)
- [ ] Database indexing
- [ ] Redis optimization
- [ ] Server resource tuning

## 🔄 Backup and Recovery

### Backup Strategy
- [ ] Database backups (daily)
- [ ] File storage backups
- [ ] Configuration backups
- [ ] Backup verification
- [ ] Offsite backup storage

### Recovery Procedures
- [ ] Recovery time objectives (RTO) defined
- [ ] Recovery point objectives (RPO) defined
- [ ] Recovery procedures documented
- [ ] Recovery testing scheduled
- [ ] Disaster recovery plan

## ✅ Final Verification

Before going live, ensure all items above are completed and verified. The application should be:

- ✅ **Secure**: All security measures implemented
- ✅ **Stable**: Thoroughly tested and monitored
- ✅ **Scalable**: Can handle expected load
- ✅ **Maintainable**: Well documented and monitored
- ✅ **Recoverable**: Backup and recovery procedures in place

## 📞 Support Contacts

- **Development Team**: [contact information]
- **DevOps Team**: [contact information]
- **Security Team**: [contact information]
- **Database Admin**: [contact information]
- **Infrastructure Team**: [contact information]

---

**Last Updated**: [Date]
**Version**: 1.0
**Next Review**: [Date]