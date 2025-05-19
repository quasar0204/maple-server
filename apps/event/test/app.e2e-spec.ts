import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventModule } from './../src/event.module';

describe('EventController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
