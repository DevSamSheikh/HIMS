export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    name: process.env.DB_NAME || "hims",
    synchronize: process.env.NODE_ENV !== "production",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "accessSecretKey",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refreshSecretKey",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  mail: {
    host: process.env.MAIL_HOST || "smtp.example.com",
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USER || "user@example.com",
    password: process.env.MAIL_PASSWORD || "password",
    from: process.env.MAIL_FROM || "HIMS <noreply@hims.com>",
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:5173",
  },
  trial: {
    durationDays: parseInt(process.env.TRIAL_DURATION_DAYS, 10) || 14,
  },
});
