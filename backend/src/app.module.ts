import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ModulesModule } from "./modules/modules.module";
import { MailModule } from "./mail/mail.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import configuration from "./config/configuration";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("database.synchronize"),
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ModulesModule,
    MailModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
