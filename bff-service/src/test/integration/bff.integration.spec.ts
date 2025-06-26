import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AppModule } from '../../app.module';

describe('BFF Integration (login + getMyDocuments)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn(),
        get: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    httpService = moduleFixture.get(HttpService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('login puis getMyDocuments', async () => {
    const fakeTokens = { accessToken: 'at', refreshToken: 'rt' };
    const loginResponse: AxiosResponse = {
      data: fakeTokens,
      status: 201,
      statusText: 'Created',
      headers: { 'set-cookie': ['rt'] },
      config: {} as any,
      request: {},
    };
    (httpService.post as jest.Mock).mockReturnValueOnce(of(loginResponse));

    const docs = [{ id: 'doc1', title: 'T1' }];
    const docsResponse: AxiosResponse = {
      data: docs,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      request: {},
    };
    (httpService.get as jest.Mock).mockReturnValueOnce(of(docsResponse));

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'u@e.com', password: 'pwd' })
      .expect(201);

    const cookieHeader = loginRes.headers['set-cookie'];
    expect(cookieHeader).toEqual(['rt']);

    const docsRes = await request(app.getHttpServer())
      .get('/api/v1/me/documents')
      .set('Authorization', 'Bearer at')
      .set('Cookie', cookieHeader)
      .expect(200);

    expect(docsRes.body).toEqual(docs);

    expect((httpService.post as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((httpService.get as jest.Mock)).toHaveBeenCalledTimes(1);
  });
});
