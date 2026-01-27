import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusHistoryService } from '../status-history/status-history.service';

describe('PackagesService', () => {
  let service: PackagesService;

  const prismaMock = {
    client: {
      package: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    },
  };

  const statusHistoryMock = {
    record: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: StatusHistoryService,
          useValue: statusHistoryMock,
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
