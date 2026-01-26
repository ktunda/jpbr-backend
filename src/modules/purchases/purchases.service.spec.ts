import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusHistoryService } from '../status-history/status-history.service';

describe('PurchasesService', () => {
  let service: PurchasesService;

  const prismaMock = {
    client: {
      purchase: {
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
        PurchasesService,
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

    service = module.get<PurchasesService>(PurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow CLIENT to move from CADASTRADO to EM_TRANSITO_JP and record history', async () => {
    // Arrange
    prismaMock.client.purchase.findUnique.mockResolvedValue({
      id: 'purchase-1',
      status: 'CADASTRADO',
    });

    prismaMock.client.purchase.update.mockResolvedValue({
      id: 'purchase-1',
      status: 'EM_TRANSITO_JP',
    });

    // Act
    const result = await service.transitionStatus(
      'purchase-1',
      'EM_TRANSITO_JP',
      'CLIENT',
    );

    // Assert
    expect(prismaMock.client.purchase.findUnique).toHaveBeenCalledWith({
      where: { id: 'purchase-1' },
    });

    expect(prismaMock.client.purchase.update).toHaveBeenCalledWith({
      where: { id: 'purchase-1' },
      data: { status: 'EM_TRANSITO_JP' },
    });

    expect(statusHistoryMock.record).toHaveBeenCalledWith({
      entityType: 'PURCHASE',
      entityId: 'purchase-1',
      fromStatus: 'CADASTRADO',
      toStatus: 'EM_TRANSITO_JP',
    });

    expect(result.status).toBe('EM_TRANSITO_JP');
  });
});
