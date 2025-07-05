import { NotFoundException } from '@nestjs/common';
import { DocumentsController } from '../documents.controller';
import { DocumentsService } from '../documents.service';
import { AuthRequest } from '../../common/types/auth-request.type';

describe('DocumentsController (unit)', () => {
  let controller: DocumentsController;
  let docsServiceMock: Partial<DocumentsService>;

  beforeAll(() => {
    docsServiceMock = {
      remove: jest.fn(),
      deleteAllUserDocuments: jest.fn(),
    };
    controller = new DocumentsController(
      docsServiceMock as any,
      {} as any
    );
  });

  beforeEach(() => {
    (docsServiceMock.remove as jest.Mock).mockReset();
    (docsServiceMock.deleteAllUserDocuments as jest.Mock).mockReset();
  });

  it('doit appeler remove du service pour la suppression individuelle', async () => {
    const req = { user: { sub: 'user-id' } } as unknown as AuthRequest;
    const docId = 'doc-123';
    (docsServiceMock.remove as jest.Mock).mockResolvedValue(undefined);

    await controller.removeMyDocument(req, docId);

    expect(docsServiceMock.remove).toHaveBeenCalledWith('user-id', docId);
  });

  it('doit propager l’erreur si le service remove échoue', async () => {
    const req = { user: { sub: 'user-id' } } as unknown as AuthRequest;
    const docId = 'doc-err';
    (docsServiceMock.remove as jest.Mock).mockRejectedValue(new NotFoundException());

    await expect(controller.removeMyDocument(req, docId))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('doit appeler deleteAllUserDocuments du service pour la suppression bulk', async () => {
    const req = { user: { sub: 'user-id' } } as unknown as AuthRequest;
    (docsServiceMock.deleteAllUserDocuments as jest.Mock).mockResolvedValue(undefined);

    await controller.removeAllMyDocuments(req);

    expect(docsServiceMock.deleteAllUserDocuments).toHaveBeenCalledWith('user-id');
  });

  it('doit propager l’erreur si deleteAllUserDocuments échoue', async () => {
    const req = { user: { sub: 'user-id' } } as unknown as AuthRequest;
    (docsServiceMock.deleteAllUserDocuments as jest.Mock).mockRejectedValue(new Error('fail'));

    await expect(controller.removeAllMyDocuments(req))
      .rejects.toThrow('fail');
  });
});
