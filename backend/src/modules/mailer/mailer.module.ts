import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { configuration } from '../../infrastructure/config/configuration';

const { host, port, user, password } = configuration().smtp;
const EmailModule = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: {
      host,
      port,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user,
        pass: password,
      },

      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: `${__dirname}/templates`,
        adapter: new PugAdapter(),
        options: {
          strict: false,
        },
      },
    },
  }),
});

export default EmailModule;
