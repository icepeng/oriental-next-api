// import { BadRequestException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { Repository } from 'typeorm';
// import { Survey } from '../survey/survey.entity';
// import { User } from '../user/user.entity';
// import { ResponseService } from './response.service';
// import { SurveyResponse } from './survey-response.entity';

// describe('ResponseService', () => {
//   let responseService: ResponseService;
//   let surveyRepository: Repository<Survey>;
//   let responseRepository: Repository<SurveyResponse>;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       components: [
//         ResponseService,
//         {
//           provide: 'SurveyRepository',
//           useClass: Repository,
//         },
//         {
//           provide: 'SurveyResponseRepository',
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     responseService = module.get<ResponseService>(ResponseService);
//     surveyRepository = module.get<Repository<Survey>>('SurveyRepository');
//     responseRepository = module.get<Repository<SurveyResponse>>(
//       'SurveyResponseRepository',
//     );
//   });

//   describe('create', () => {
//     let saveSpy: any;

//     beforeEach(() => {
//       jest.spyOn(responseRepository, 'create').mockImplementation(x => x);
//       saveSpy = jest
//         .spyOn(responseRepository, 'save')
//         .mockImplementation(x => ({ id: 1, ...x }));
//     });

//     afterEach(() => {
//       jest.clearAllMocks();
//     });

//     it('should throw BadRequestExeption if survey is overdue', async () => {
//       jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
//         const survey = new Survey();
//         survey.id = 1;
//         survey.startTime = '2018-04-01T04:00:00.000Z';
//         survey.endTime = '2018-04-02T04:00:00.000Z';
//         survey.status = 'ongoing';
//         survey.isPreRelease = true;
//         return survey;
//       });

//       await expect(
//         responseService.create(1, {
//           id: '1',
//         } as User),
//       ).rejects.toBeInstanceOf(BadRequestException);
//     });

//     it('should throw BadRequestExeption if there is existing response', async () => {
//       jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
//         const survey = new Survey();
//         survey.id = 1;
//         survey.startTime = '2018-04-01T04:00:00.000Z';
//         survey.status = 'ongoing';
//         survey.isPreRelease = true;
//         return survey;
//       });
//       jest.spyOn(responseRepository, 'findOne').mockImplementation(() => ({
//         id: 1,
//       }));

//       await expect(
//         responseService.create(1, {
//           id: '1',
//         } as User),
//       ).rejects.toBeInstanceOf(BadRequestException);
//     });
//   });
// });
