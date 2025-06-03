import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';

describe('Documents (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/api/documents (GET) should return empty array initially', async () => {
        const token = '<YOUR_VALID_ACCESS_TOKEN>';

        const res = await request(app.getHttpServer())
            .get('/api/documents')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await app.close();
    });
});
