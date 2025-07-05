import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { MinioConfigService } from '../../../minio/minio.config';
import { MinioConfigServiceMock } from '../../../minio/minio.mock';

describe('DocumentsController (e2e) - Suppression individuelle', () => {
  let app: INestApplication;
  let jwt: string;
  let docId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MinioConfigService)
      .useClass(MinioConfigServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    async function createTestUserAndGetJwt(): Promise<string> {
      const email = `test${Date.now()}@e2e.com`;
      // REGISTER
      const registerRes = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email, password: 'testpass', firstName: 'Test', lastName: 'User' });

      console.log('Register response:', registerRes.status, registerRes.body, registerRes.text);

      // LOGIN
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'testpass' });

      console.log('Login response:', loginRes.status, loginRes.body, loginRes.text);

      if (!loginRes.body || !loginRes.body.accessToken) {
        throw new Error('No accessToken returned at login');
      }
      return loginRes.body.accessToken;
    }

    jwt = await createTestUserAndGetJwt();
    console.log('JWT used in test:', jwt);

    const res = await request(app.getHttpServer())
      .post('/api/v1/documents/me')
      .set('Authorization', `Bearer ${jwt}`)
      .attach('file', Buffer.from('Ceci est un test'), 'test.txt')
      .field('title', 'doc test')
      .field('category', 'autre');
    docId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('supprime le document et le retire de la liste', async () => {
    const deleteRes = await request(app.getHttpServer())
      .delete(`/api/v1/me/documents/${docId}`)
      .set('Authorization', `Bearer ${jwt}`);
    console.log('DELETE status:', deleteRes.status, deleteRes.body, deleteRes.text);
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app.getHttpServer())
      .get('/api/v1/me/documents')
      .set('Authorization', `Bearer ${jwt}`);
    expect(listRes.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: docId })])
    );
  });
});