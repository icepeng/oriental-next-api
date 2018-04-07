import { Component } from '@nestjs/common';
import * as passport from 'passport';
import { Strategy } from 'passport-bnet';

// tslint:disable-next-line:no-var-requires
const Secret = require('../../../secrets/secret.json');

@Component()
export class BnetStrategy extends Strategy {
  constructor() {
    super(
      {
        clientID: 'hmvrryh5b4c75r74mrheqvcfu84g7n2q',
        clientSecret: Secret.clientSecret,
        callbackURL: 'https://localhost:3002/api/v1/auth/bnet/callback',
        region: 'kr',
      },
      async (accessToken, refreshToken, profile, done) =>
        await this.verify(accessToken, refreshToken, profile, done),
    );
    passport.use(this);
  }

  public async verify(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
}
