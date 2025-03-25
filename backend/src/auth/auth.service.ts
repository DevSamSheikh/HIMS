import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { ModulesService } from "../modules/modules.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import {
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private modulesService: ModulesService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        "Please verify your email before logging in",
      );
    }

    const tokens = await this.generateTokens(user);

    if (loginDto.rememberMe) {
      await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    }

    // Get user's active subscriptions/modules
    const activeSubscriptions =
      await this.subscriptionsService.findActiveByUserId(user.id);
    const activeModules = activeSubscriptions.map((sub) => sub.moduleId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        facilityName: user.facilityName,
        role: user.role,
      },
      modules: activeModules,
      ...tokens,
    };
  }

  async signup(signupDto: SignupDto) {
    // Create the user
    const user = await this.usersService.create({
      name: signupDto.name,
      email: signupDto.email,
      password: signupDto.password,
      phone: signupDto.phone,
      facilityName: signupDto.facilityName,
      facilityType: signupDto.facilityType,
    });

    // Generate verification token
    const verificationToken = uuidv4();
    await this.usersService.setVerificationToken(user.id, verificationToken);

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    // Create trial subscriptions for selected modules
    if (signupDto.selectedModules && signupDto.selectedModules.length > 0) {
      const trialDurationDays =
        this.configService.get<number>("trial.durationDays");
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + trialDurationDays);

      // Create subscription for each selected module
      for (const moduleId of signupDto.selectedModules) {
        await this.subscriptionsService.create({
          userId: user.id,
          moduleId,
          startDate: new Date(),
          endDate: trialEndDate,
          isTrial: true,
          isActive: true,
          // Apply promo code discount if provided
          promoCode: signupDto.promoCode || null,
        });
      }
    }

    return {
      message:
        "User registered successfully. Please check your email to verify your account.",
      userId: user.id,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByVerificationToken(
      verifyEmailDto.token,
    );
    await this.usersService.markEmailAsVerified(user.email);

    return {
      message: "Email verified successfully. You can now log in.",
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      userId,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.setRefreshToken(userId, null);
    return { message: "Logged out successfully" };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findByEmail(forgotPasswordDto.email);

      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

      await this.usersService.setPasswordResetToken(
        user.email,
        resetToken,
        resetExpires,
      );

      // Send password reset email
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);

      return {
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      // Don't reveal if the email exists or not for security reasons
      return {
        message:
          "If your email is registered, you will receive a password reset link",
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(
      resetPasswordDto.token,
    );

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    await this.usersService.resetPassword(user.id, resetPasswordDto.password);

    return {
      message: "Password reset successfully",
    };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.accessSecret"),
      expiresIn: this.configService.get("jwt.accessExpiresIn"),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.refreshSecret"),
      expiresIn: this.configService.get("jwt.refreshExpiresIn"),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
