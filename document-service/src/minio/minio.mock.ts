export class MinioClientMock {
  async putObject() {}
  async getObject() { return Buffer.from('mock'); }
  async removeObject() {}
  async listObjectsV2() { return { on: () => {} }; }
}

export class MinioConfigServiceMock {
  getBucket() { return 'test-bucket'; }
  client = new MinioClientMock();
}