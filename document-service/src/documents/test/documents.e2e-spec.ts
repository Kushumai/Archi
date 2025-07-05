import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('DocumentsController (e2e)', () => {
  let app: INestApplication;
  let jwt: string;
  let jwtOther: string;
  let docId: string;

  async function createTestUserAndGetJwt(email = `test${Date.now()}@e2e.com`) {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'testpass', firstName: 'Test', lastName: 'User' });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'testpass' });
    return loginRes.body.accessToken;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    jwt = await createTestUserAndGetJwt();
    jwtOther = await createTestUserAndGetJwt(`other${Date.now()}@e2e.com`);

    const res = await request(app.getHttpServer())
      .post('/documents/me')
      .set('Authorization', `Bearer ${jwt}`)
      .attach('file', Buffer.from('testfile'), 'file.txt')
      .field('title', 'doc')
      .field('category', 'autre');
    docId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });


  it('supprime le document individuel - succès', async () => {
    const res = await request(app.getHttpServer())
      .post('/documents/me')
      .set('Authorization', `Bearer ${jwt}`)
      .attach('file', Buffer.from('another'), 'file2.txt')
      .field('title', 'doc2')
      .field('category', 'autre');
    const id = res.body.id;

    const deleteRes = await request(app.getHttpServer())
      .delete(`/documents/me/${id}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app.getHttpServer())
      .get('/documents/me')
      .set('Authorization', `Bearer ${jwt}`);
    expect(listRes.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id })])
    );
  });

  it('renvoie 404 si document non trouvé', async () => {
    const deleteRes = await request(app.getHttpServer())
      .delete('/documents/me/unknown-id')
      .set('Authorization', `Bearer ${jwt}`);
    expect(deleteRes.status).toBe(404);
  });

  it('renvoie 404 si document appartient à un autre utilisateur', async () => {
    const deleteRes = await request(app.getHttpServer())
      .delete(`/documents/me/${docId}`)
      .set('Authorization', `Bearer ${jwtOther}`);
    expect(deleteRes.status).toBe(404);
  });

  it('renvoie 401 si pas de JWT', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/documents/me/${docId}`);
    expect(res.status).toBe(401);
  });


  it('supprime tous les documents du user - succès', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app.getHttpServer())
        .post('/documents/me')
        .set('Authorization', `Bearer ${jwt}`)
        .attach('file', Buffer.from(`file${i}`), `file${i}.txt`)
        .field('title', `doc${i}`)
        .field('category', 'autre');
    }

    const deleteRes = await request(app.getHttpServer())
      .delete('/documents/me')
      .set('Authorization', `Bearer ${jwt}`);
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app.getHttpServer())
      .get('/documents/me')
      .set('Authorization', `Bearer ${jwt}`);
    expect(listRes.body.length).toBe(0);
  });

  it('bulk delete sur user sans document renvoie 204', async () => {
    const freshJwt = await createTestUserAndGetJwt(`fresh${Date.now()}@e2e.com`);
    const res = await request(app.getHttpServer())
      .delete('/documents/me')
      .set('Authorization', `Bearer ${freshJwt}`);
    expect(res.status).toBe(204);
  });

  it('renvoie 401 sur bulk delete sans JWT', async () => {
    const res = await request(app.getHttpServer())
      .delete('/documents/me');
    expect(res.status).toBe(401);
  });
});
