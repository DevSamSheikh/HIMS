import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("mail.host"),
      port: this.configService.get("mail.port"),
      secure: this.configService.get("mail.port") === 465,
      auth: {
        user: this.configService.get("mail.user"),
        pass: this.configService.get("mail.password"),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get("frontend.url");
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get("mail.from"),
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to HIMS!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The HIMS Team</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get("frontend.url");
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get("mail.from"),
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The HIMS Team</p>
        </div>
      `,
    });
  }

  async sendTrialEndingSoonEmail(
    email: string,
    daysLeft: number,
  ): Promise<void> {
    const frontendUrl = this.configService.get("frontend.url");
    const subscriptionUrl = `${frontendUrl}/subscription`;

    await this.transporter.sendMail({
      from: this.configService.get("mail.from"),
      to: email,
      subject: `Your HIMS trial ends in ${daysLeft} days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Trial is Ending Soon</h2>
          <p>Your HIMS trial period will end in ${daysLeft} days. To continue using all features, please upgrade to a paid subscription.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${subscriptionUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Manage Subscription
            </a>
          </div>
          <p>If you have any questions or need assistance, please contact our support team.</p>
          <p>Best regards,<br>The HIMS Team</p>
        </div>
      `,
    });
  }
}
