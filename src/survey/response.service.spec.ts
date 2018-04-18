import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Card } from '../card/card.entity';
import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import { CardResponseDto } from './dto/create-response.dto';
import { ResponseService } from './response.service';
import { SurveyResponse } from './survey-response.entity';
import { Survey } from './survey.entity';
import { ExpansionResponse } from './expansion-response.entity';

describe('ResponseService', () => {
  let responseService: ResponseService;
  let surveyRepository: Repository<Survey>;
  let responseRepository: Repository<SurveyResponse>;
  let cardResponseRepository: Repository<CardResponse>;
  let expansionResponseRepository: Repository<ExpansionResponse>;
  let cardRepository: Repository<Card>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      components: [
        ResponseService,
        {
          provide: 'SurveyRepository',
          useClass: Repository,
        },
        {
          provide: 'SurveyResponseRepository',
          useClass: Repository,
        },
        {
          provide: 'CardResponseRepository',
          useClass: Repository,
        },
        {
          provide: 'ExpansionResponseRepository',
          useClass: Repository,
        },
        {
          provide: 'CardRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    responseService = module.get<ResponseService>(ResponseService);
    surveyRepository = module.get<Repository<Survey>>('SurveyRepository');
    responseRepository = module.get<Repository<SurveyResponse>>(
      'SurveyResponseRepository',
    );
    cardResponseRepository = module.get<Repository<CardResponse>>(
      'CardResponseRepository',
    );
    expansionResponseRepository = module.get<Repository<ExpansionResponse>>(
      'ExpansionResponseRepository',
    );
    cardRepository = module.get<Repository<Card>>('CardRepository');
  });

  describe('create', () => {
    let saveSpy: any;

    beforeEach(() => {
      jest.spyOn(responseRepository, 'create').mockImplementation(x => x);
      saveSpy = jest
        .spyOn(responseRepository, 'save')
        .mockImplementation(x => ({ id: 1, ...x }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should save response entity', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => undefined);

      await responseService.create(1, {
        id: '1',
      } as User);

      expect(saveSpy).toBeCalledWith({ survey: { id: 1 }, user: { id: '1' } });
    });

    it('should throw BadRequestExeption if survey is closed', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
        endTime: new Date(new Date().getTime() - 100000),
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => undefined);

      await expect(
        responseService.create(1, {
          id: '1',
        } as User),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestExeption if there is existing response', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
      }));
      jest.spyOn(responseRepository, 'findOne').mockImplementation(() => ({
        id: 1,
      }));

      await expect(
        responseService.create(1, {
          id: '1',
        } as User),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('createCardResponse', () => {
    let saveSpy: any;

    beforeEach(() => {
      jest.spyOn(cardResponseRepository, 'create').mockImplementation(x => x);
      saveSpy = jest
        .spyOn(cardResponseRepository, 'save')
        .mockImplementation(x => x);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should save cardResponse entity', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
        expansions: [{ code: 'the-witchwood' }],
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => ({ id: 1 }));
      jest
        .spyOn(cardRepository, 'findOne')
        .mockImplementation(() => ({ id: 'toki-time-tinker' }));

      await responseService.createCardResponse(
        1,
        1,
        {
          id: '1',
        } as User,
        {
          card: 'toki-time-tinker',
          power: 20,
          generality: 80,
          description: '',
        },
      );

      expect(saveSpy).toBeCalledWith({
        card: { id: 'toki-time-tinker' },
        response: { id: 1 },
        power: 20,
        generality: 80,
        description: '',
      });
    });

    it('should throw BadRequestExeption if survey is closed', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
        endTime: new Date(new Date().getTime() - 100000),
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => ({ id: 1 }));
      jest
        .spyOn(cardRepository, 'findOne')
        .mockImplementation(() => ({ id: 'toki-time-tinker' }));

      await expect(
        responseService.createCardResponse(
          1,
          1,
          {
            id: '1',
          } as User,
          {
            card: 'toki-time-tinker',
            power: 20,
            generality: 80,
            description: '',
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('createExpansionResponse', () => {
    let saveSpy: any;

    beforeEach(() => {
      jest
        .spyOn(expansionResponseRepository, 'create')
        .mockImplementation(x => x);
      saveSpy = jest
        .spyOn(expansionResponseRepository, 'save')
        .mockImplementation(x => x);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should save expansionResponse entity', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => ({ id: 1 }));

      await responseService.createExpansionResponse(
        1,
        1,
        {
          id: '1',
        } as User,
        {
          fun: 20,
          balance: 80,
          description: '',
        },
      );

      expect(saveSpy).toBeCalledWith({
        response: { id: 1 },
        fun: 20,
        balance: 80,
        description: '',
      });
    });

    it('should throw BadRequestExeption if survey is closed', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => ({
        id: 1,
        endTime: new Date(new Date().getTime() - 100000),
      }));
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => ({ id: 1 }));

      await expect(
        responseService.createExpansionResponse(
          1,
          1,
          {
            id: '1',
          } as User,
          {
            fun: 20,
            balance: 80,
            description: '',
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
