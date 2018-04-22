import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { ExpansionResponse } from './expansion-response.entity';
import { ExpansionResponseService } from './expansion-response.service';
import { SurveyResponse } from './survey-response.entity';

describe('ExpansionResponseService', () => {
  let expansionResponseService: ExpansionResponseService;
  let surveyRepository: Repository<Survey>;
  let responseRepository: Repository<SurveyResponse>;
  let expansionResponseRepository: Repository<ExpansionResponse>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      components: [
        ExpansionResponseService,
        {
          provide: 'SurveyRepository',
          useClass: Repository,
        },
        {
          provide: 'SurveyResponseRepository',
          useClass: Repository,
        },
        {
          provide: 'ExpansionResponseRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    expansionResponseService = module.get<ExpansionResponseService>(
      ExpansionResponseService,
    );
    surveyRepository = module.get<Repository<Survey>>('SurveyRepository');
    responseRepository = module.get<Repository<SurveyResponse>>(
      'SurveyResponseRepository',
    );
    expansionResponseRepository = module.get<Repository<ExpansionResponse>>(
      'ExpansionResponseRepository',
    );
  });

  describe('save', () => {
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
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
        const survey = new Survey();
        survey.id = 1;
        survey.startTime = '2018-04-01T04:00:00.000Z';
        survey.status = 'ongoing';
        survey.isPreRelease = true;
        return survey;
      });
      jest
        .spyOn(responseRepository, 'findOne')
        .mockImplementation(() => ({ id: 1 }));

      await expansionResponseService.save(
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

    it('should throw BadRequestExeption if survey is overdue', async () => {
      jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
        const survey = new Survey();
        survey.id = 1;
        survey.startTime = '2018-04-01T04:00:00.000Z';
        survey.endTime = '2018-04-02T04:00:00.000Z';
        survey.status = 'ongoing';
        survey.isPreRelease = true;
        return survey;
      });

      await expect(
        expansionResponseService.save(
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
