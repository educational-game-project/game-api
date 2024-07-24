import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { School } from "@app/common/model/schema/schools.schema";
import { Game } from "@app/common/model/schema/game.schema";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { LogsService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @Inject(LogsService) private readonly logsService: LogsService,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  async getDashboardInfo(user: User): Promise<any> {
    try {
      let studentsCount: number = 0;
      let activeStudents: number = 0;
      let adminCount: number = 0;
      let admins: any[] = [];
      let activeAdmin: number = 0;
      let gameCount: number = 0;
      let games: any[] = [];
      let schoolCount: number = 0;
      let schools: any[] = [];
      let result: any = {}

      let studentQuery: any = { deletedAt: null, role: UserRole.USER }
      let adminQuery: any = { deletedAt: null, role: UserRole.ADMIN }

      if (user.role === UserRole.ADMIN) {
        studentQuery = { ...studentQuery, school: user.school }
        adminQuery = { ...adminQuery, school: user.school }
      }

      // Schools
      schoolCount = await this.schoolModel.countDocuments({ deletedAt: null });
      schools = await this.schoolModel.find({ deletedAt: null })
        .select("_id name address adminsCount studentsCount images createdAt updatedAt")
        .sort({ createdAt: -1 })
        .populate('images');

      // Admin
      adminCount = await this.userModel.countDocuments(adminQuery);
      admins = await this.userModel.find(adminQuery).populate(['image', 'school'])
      activeAdmin = await this.userModel.countDocuments({ ...adminQuery, isActive: true });

      // Student
      studentsCount = await this.userModel.countDocuments(studentQuery).populate(['image', 'school'])
      activeStudents = await this.userModel.countDocuments({ ...studentQuery, isActive: true });

      // Games
      gameCount = await this.gameModel.countDocuments({ deletedAt: null });
      games = await this.gameModel.find({ deletedAt: null }).populate('images')

      result = {
        studentsCount,
        activeStudents,
        adminCount,
        admins,
        activeAdmin,
        gameCount,
        games,
        schoolCount,
        schools,
      }

      if (user.role === UserRole.SUPER_ADMIN) delete result.admins

      await this.logsService.logging({
        target: TargetLogEnum.DASHBOARD,
        description: `${user?.name} success get dashboard data`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin('Get', 'Dashboard'), result)
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.DASHBOARD,
        description: `${user?.name} failed get dashboard data`,
        success: false,
      })
      this.logger.error(this.getDashboardInfo.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}