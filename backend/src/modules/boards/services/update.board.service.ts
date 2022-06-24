import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, LeanDocument } from 'mongoose';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { GetTeamServiceInterface } from '../../teams/interfaces/services/get.team.service.interface';
import * as Teams from '../../teams/interfaces/types';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(Teams.TYPES.services.GetTeamService)
    private getTeamService: GetTeamServiceInterface,
  ) {}

  update(userId: string, boardId: string, boardData: UpdateBoardDto) {
    return this.boardModel
      .findOneAndUpdate(
        {
          _id: boardId,
          createdBy: userId,
        },
        boardData,
        {
          new: true,
        },
      )
      .lean()
      .exec();
  }

  async mergeBoards(subBoardId: string, userId: string) {
    const [subBoard, board] = await Promise.all([
      this.boardModel.findById(subBoardId).lean().exec(),
      this.boardModel
        .findOne({ dividedBoards: { $in: [subBoardId] } })
        .lean()
        .exec(),
    ]);
    if (!subBoard || !board || subBoard.submitedByUser) return null;
    const team = await this.getTeamService.getTeam(
      (board.team as ObjectId).toString(),
    );
    if (!team) return null;

    const newSubColumns = this.generateNewSubColumns(subBoard);

    const newColumns = [...board.columns];
    for (let i = 0; i < newColumns.length; i++) {
      newColumns[i].cards = [...newColumns[i].cards, ...newSubColumns[i].cards];
    }

    this.boardModel
      .findOneAndUpdate(
        {
          _id: subBoardId,
        },
        {
          $set: {
            submitedByUser: userId,
            submitedAt: new Date(),
          },
        },
      )
      .lean()
      .exec();

    return this.boardModel
      .findOneAndUpdate(
        {
          _id: board._id,
        },
        {
          $set: { columns: newColumns },
        },
        { new: true },
      )
      .lean()
      .exec();
  }

  generateNewSubColumns(subBoard: LeanDocument<BoardDocument>) {
    return [...subBoard.columns].map((column) => {
      const newColumn = {
        title: column.title,
        color: column.color,
        cards: column.cards.map((card) => {
          const newCard = {
            text: card.text,
            createdBy: card.createdBy,
            votes: card.votes,
            createdByTeam: subBoard.title.replace('board', ''),
            comments: card.comments.map((comment) => {
              return {
                text: comment.text,
                createdBy: comment.createdBy,
              };
            }),
            items: card.items.map((cardItem) => {
              return {
                text: cardItem.text,
                votes: cardItem.votes,
                createdByTeam: subBoard.title,
                createdBy: card.createdBy,
                comments: cardItem.comments.map((comment) => {
                  return {
                    text: comment.text,
                    createdBy: comment.createdBy,
                  };
                }),
              };
            }),
          };
          return newCard;
        }),
      };
      return newColumn;
    });
  }
}
