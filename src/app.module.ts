import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/auth.guard';
// import { getDirName } from './utils/getDirName';
import { CommentsModule } from './modules/comments/comments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContentsModule } from './modules/contents/contents.module';
import { HistoriesModule } from './modules/histories/histories.module';
import { LinksModule } from './modules/links/links.module';
import { PageModule } from './modules/page/page.module';
import { SmtpModule } from './modules/smtp/smtp.module';
import { TagsModule } from './modules/tags/tags.module';
import { WorksModule } from './modules/works/works.module';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env/.env.${process.env.RUNNING_ENV}`],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      username: process.env.SQL_USER_NAME, //账号
      password: process.env.SQL_PASSWORD, //密码
      host: process.env.SQL_HOST, //host
      port: 3306, //
      database: process.env.SQL_DATA_BASE, //库名
      entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),
    AuthModule,
    CommentsModule,
    CategoriesModule,
    ContentsModule,
    HistoriesModule,
    LinksModule,
    PageModule,
    SmtpModule,
    TagsModule,
    WorksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
