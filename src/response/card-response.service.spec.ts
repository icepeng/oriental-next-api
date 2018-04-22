// import { BadRequestException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { Repository } from 'typeorm';
// import { Card } from '../card/card.entity';
// import {
//   POINT_REWARD_CARD,
//   MAX_REWARDED_CARD_PER_SURVEY,
// } from '../common/config';
// import { Survey } from '../survey/survey.entity';
// import { UserInfo } from '../user/user-info.entity';
// import { User } from '../user/user.entity';
// import { CardResponse } from './card-response.entity';
// import { CardResponseService } from './card-response.service';
// import { SurveyResponse } from './survey-response.entity';

// describe('CardResponseService', () => {
//   let cardResponseService: CardResponseService;
//   let surveyRepository: Repository<Survey>;
//   let responseRepository: Repository<SurveyResponse>;
//   let cardResponseRepository: Repository<CardResponse>;
//   let cardRepository: Repository<Card>;
//   let userInfoRepository: Repository<UserInfo>;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       components: [
//         CardResponseService,
//         {
//           provide: 'SurveyRepository',
//           useClass: Repository,
//         },
//         {
//           provide: 'SurveyResponseRepository',
//           useClass: Repository,
//         },
//         {
//           provide: 'CardResponseRepository',
//           useClass: Repository,
//         },
//         {
//           provide: 'CardRepository',
//           useClass: Repository,
//         },
//         {
//           provide: 'UserInfoRepository',
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     cardResponseService = module.get<CardResponseService>(CardResponseService);
//     surveyRepository = module.get<Repository<Survey>>('SurveyRepository');
//     responseRepository = module.get<Repository<SurveyResponse>>(
//       'SurveyResponseRepository',
//     );
//     cardResponseRepository = module.get<Repository<CardResponse>>(
//       'CardResponseRepository',
//     );
//     cardRepository = module.get<Repository<Card>>('CardRepository');
//     userInfoRepository = module.get<Repository<UserInfo>>('UserInfoRepository');
//   });

//   describe('save', () => {
//     let cardResponseSpy: any;

//     beforeEach(() => {
//       jest.spyOn(cardResponseRepository, 'create').mockImplementation(x => x);
//       cardResponseSpy = jest
//         .spyOn(cardResponseRepository, 'save')
//         .mockImplementation(x => x);
//     });

//     afterEach(() => {
//       jest.clearAllMocks();
//     });

//     it('should save cardResponse entity', async () => {
//       jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
//         const survey = new Survey();
//         survey.id = 1;
//         survey.startTime = '2018-04-01T04:00:00.000Z';
//         survey.status = 'ongoing';
//         survey.isPreRelease = true;
//         return survey;
//       });
//       jest
//         .spyOn(responseRepository, 'findOne')
//         .mockImplementation(() => ({ id: 1 }));
//       jest
//         .spyOn(cardRepository, 'findOne')
//         .mockImplementation(() => ({ id: 'toki-time-tinker' }));

//       await cardResponseService.save(
//         1,
//         1,
//         {
//           id: '1',
//         } as User,
//         {
//           card: 'toki-time-tinker',
//           power: 20,
//           generality: 80,
//           description: '',
//         },
//       );

//       expect(cardResponseSpy).toBeCalledWith({
//         card: { id: 'toki-time-tinker' },
//         response: { id: 1 },
//         power: 20,
//         generality: 80,
//         description: '',
//       });
//     });

//     it('should update userInfo when survey is after-release', async () => {
//       jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
//         const survey = new Survey();
//         survey.id = 1;
//         survey.startTime = '2018-04-01T04:00:00.000Z';
//         survey.status = 'ongoing';
//         survey.isPreRelease = false;
//         return survey;
//       });
//       jest
//         .spyOn(responseRepository, 'findOne')
//         .mockImplementation(() => ({ id: 1 }));
//       jest
//         .spyOn(cardRepository, 'findOne')
//         .mockImplementation(() => ({ id: 'toki-time-tinker' }));
//       jest
//         .spyOn(cardResponseRepository, 'findOne')
//         .mockImplementation(() => undefined);
//       jest
//         .spyOn(cardResponseRepository, 'count')
//         .mockImplementation(() => MAX_REWARDED_CARD_PER_SURVEY - 1);
//       jest
//         .spyOn(userInfoRepository, 'findOne')
//         .mockImplementation(() => ({ id: '1', point: 0 }));
//       const userInfoSpy = jest
//         .spyOn(userInfoRepository, 'save')
//         .mockImplementation(x => x);

//       await cardResponseService.save(
//         1,
//         1,
//         {
//           id: '1',
//         } as User,
//         {
//           card: 'toki-time-tinker',
//           power: 20,
//           generality: 80,
//           description: '',
//         },
//       );

//       expect(userInfoSpy).toBeCalledWith({
//         id: '1',
//         point: POINT_REWARD_CARD,
//       });
//     });

//     it('should not update userInfo when count > MAX_REWARDED_CARD_PER_SURVEY', async () => {
//       jest.spyOn(surveyRepository, 'findOne').mockImplementation(() => {
//         const survey = new Survey();
//         survey.id = 1;
//         survey.startTime = '2018-04-01T04:00:00.000Z';
//         survey.status = 'ongoing';
//         survey.isPreRelease = false;
//         return survey;
//       });
//       jest
//         .spyOn(responseRepository, 'findOne')
//         .mockImplementation(() => ({ id: 1 }));
//       jest
//         .spyOn(cardRepository, 'findOne')
//         .mockImplementation(() => ({ id: 'toki-time-tinker' }));
//       jest
//         .spyOn(cardResponseRepository, 'findOne')
//         .mockImplementation(() => undefined);
//       jest
//         .spyOn(cardResponseRepository, 'count')
//         .mockImplementation(() => MAX_REWARDED_CARD_PER_SURVEY);
//       jest
//         .spyOn(userInfoRepository, 'findOne')
//         .mockImplementation(() => ({ id: '1', point: 0 }));
//       const userInfoSpy = jest
//         .spyOn(userInfoRepository, 'save')
//         .mockImplementation(x => x);

//       await cardResponseService.save(
//         1,
//         1,
//         {
//           id: '1',
//         } as User,
//         {
//           card: 'toki-time-tinker',
//           power: 20,
//           generality: 80,
//           description: '',
//         },
//       );

//       expect(userInfoSpy).toBeCalledWith({
//         id: '1',
//         point: 0,
//       });
//     });

//     it('should throw BadRequestExeption when survey is overdue', async () => {
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
//         cardResponseService.save(
//           1,
//           1,
//           {
//             id: '1',
//           } as User,
//           {
//             card: 'toki-time-tinker',
//             power: 20,
//             generality: 80,
//             description: '',
//           },
//         ),
//       ).rejects.toBeInstanceOf(BadRequestException);
//     });

//     it('should throw BadRequestExeption if card is not in survey-expansion', async () => {
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
//       jest.spyOn(cardRepository, 'findOne').mockImplementation(() => undefined);

//       await expect(
//         cardResponseService.save(
//           1,
//           1,
//           {
//             id: '1',
//           } as User,
//           {
//             card: 'toki-time-tinker',
//             power: 20,
//             generality: 80,
//             description: '',
//           },
//         ),
//       ).rejects.toBeInstanceOf(BadRequestException);
//     });
//   });
// });
