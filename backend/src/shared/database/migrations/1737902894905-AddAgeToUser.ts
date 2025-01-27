import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgeToUser1737902894905 implements MigrationInterface {
    name = 'AddAgeToUser1737902894905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "test" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "testtest" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "testtesttest" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "testtesttest"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "testtest"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test"`);
    }

}
