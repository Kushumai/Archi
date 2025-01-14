import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '../document.service';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentEntity, DocumentModel } from '../schemas/document.schema';

describe('DocumentService', () => {
  let service: DocumentService;

  const mockDocumentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getModelToken(DocumentEntity.name),
          useValue: mockDocumentModel,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
