import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ResponseService } from './response.service';
import { SurveyResponse } from './survey-response.entity';
import { Survey } from './survey.entity';
import { BadRequestException } from '@nestjs/common';

describe('ResponseService', () => {
  let responseService: ResponseService;
  let surveyRepository: Repository<Survey>;
  let responseRepository: Repository<SurveyResponse>;

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

    it('should return response entity', async () => {
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
});
