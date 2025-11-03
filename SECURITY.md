# Security Policy

## OWASP Security Measures

This application implements the following OWASP security best practices:

### 1. Content Security Policy (CSP)

- Implemented via `_headers` file in public directory
- Restricts sources for scripts, styles, and other resources
- Prevents XSS attacks by controlling resource loading

### 2. HTTP Security Headers

- **X-Frame-Options**: DENY - Prevents clickjacking attacks
- **X-Content-Type-Options**: nosniff - Prevents MIME-type sniffing
- **X-XSS-Protection**: Enables XSS filter in older browsers
- **Referrer-Policy**: Controls referrer information leakage
- **Permissions-Policy**: Restricts browser features

### 3. Input Validation

- All word sets are validated using Zod schemas
- User input is sanitized before processing
- Type-safe validation throughout the application

### 4. Data Protection

- No sensitive data stored in browser
- All data processing happens client-side
- No external API calls that could leak user data

### 5. Dependency Security

- Regular dependency updates
- Use of well-maintained, popular libraries
- Minimal dependency footprint

### 6. PWA Security

- Service worker only caches static assets
- No sensitive data in service worker cache
- HTTPS enforcement in production

## Reporting Security Issues

If you discover a security vulnerability, please report it to the repository maintainers.

## Security Updates

Dependencies are regularly updated to address security vulnerabilities. Run:

```bash
npm audit
npm audit fix
```

## Development Best Practices

1. **Code Reviews**: All code changes should be reviewed
2. **Linting**: ESLint configured with security rules
3. **Type Safety**: TypeScript strict mode enabled
4. **Testing**: Security-related features have test coverage
5. **CSP Compliance**: All inline scripts/styles avoid CSP violations where possible
