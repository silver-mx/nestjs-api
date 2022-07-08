import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { JwtStrategy } from './jwt-strategy';



describe('JwtStrategy', () => {
  let configService = new ConfigService({ 'JWT_SECRET': 'any-secret' });
  let dbService = new DbService(configService);
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy(configService, dbService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
});
