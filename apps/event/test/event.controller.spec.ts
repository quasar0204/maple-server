import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EventModule } from '../src/event.module';
import { JwtService } from '@nestjs/jwt';

const createToken = (role: string) => {
  const jwt = new JwtService({
    secret: process.env.JWT_SECRET || 'bimilim',
  });
  return jwt.sign({ sub: 'test-user-123', email: 'test@example.com', role });
};

describe('EventController (e2e)', () => {
  let app: INestApplication;

  let userToken: string;
  let operatorToken: string;
  let auditorToken: string;
  let adminToken: string;

  let createdEventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userToken = createToken('USER');
    operatorToken = createToken('OPERATOR');
    auditorToken = createToken('AUDITOR');
    adminToken = createToken('ADMIN');
  });

  describe('POST /events (이벤트 생성)', () => {
    it('should forbid USER', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'test-user-blocked',
          description: 'd',
          conditions: [],
          triggerType: 'ON_DEMAND',
          startDate: new Date(),
          endDate: new Date(),
          isActive: true,
        })
        .expect(403);
    });

    it('should allow OPERATOR', async () => {
      const res = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({
          title: 'valid-event',
          description: 'desc',
          conditions: [],
          triggerType: 'ON_DEMAND',
          startDate: new Date(),
          endDate: new Date(),
          isActive: true,
        })
        .expect(201);
      createdEventId = res.body._id;
    });
  });

  describe('POST /events/:eventId/claims (보상 요청)', () => {
    it('should allow USER', () => {
      return request(app.getHttpServer())
        .post(`/events/${createdEventId}/claims`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: 'test-user-123' })
        .expect(201);
    });

    it('should forbid OPERATOR', () => {
      return request(app.getHttpServer())
        .post(`/events/${createdEventId}/claims`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({ userId: 'test-user-123' })
        .expect(403);
    });
  });

  describe('GET /claims (전체 보상 이력)', () => {
    it('should allow AUDITOR', () => {
      return request(app.getHttpServer())
        .get('/claims')
        .set('Authorization', `Bearer ${auditorToken}`)
        .expect(200);
    });

    it('should forbid USER', () => {
      return request(app.getHttpServer())
        .get('/claims')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /claims/user/:id (내 이력)', () => {
    it('should allow USER', () => {
      return request(app.getHttpServer())
        .get('/claims/user/test-user-123')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    it('should forbid OPERATOR', () => {
      return request(app.getHttpServer())
        .get('/claims/user/test-user-123')
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(403);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
