import { Injectable, HttpException, HttpStatus, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ResponseService } from '@app/common/response/response.service';
import { IResponseError } from '@app/common/response/response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Users } from '../model/schema/users.schema';

@Injectable()
export class AuthHelper {
    constructor(
        private readonly jwt: JwtService,

        @InjectModel(Users.name) private readonly userModel: Model<Users>,

        @Inject(ResponseService) private readonly responseService: ResponseService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) { }

    // Validate token
    public validateToken(token: string) {
        const decoded = this.jwt.verify(token, { secret: this.configService.get('JWT_KEY') });
        return decoded;
    }

    // Decoding the JWT Token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null);
    }

    // Get User by User ID we get from decode()
    public async validateUser(decoded: any): Promise<Users> {
        const user = await this.userModel.findOne({ _id: decoded._id });

        return user;
    }

    // Generate JWT Token
    public generateToken(data: Users): string {
        return this.jwt.sign(
            data,
            { secret: this.configService.get('JWT_KEY'), expiresIn: this.configService.get('JWT_EXPIRES') }
        );
    }

    // Validate User's password
    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword);
    }

    // Encode User's password
    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    }

    // Validate JWT Token, throw forbidden error if JWT Token is invalid
    private async validate(token: string): Promise<boolean | IResponseError> {
        const decoded: unknown = this.jwt.verify(token);

        if (!decoded) {
            return this.responseService.error(HttpStatus.CONFLICT, 'User Unauthorized!', { value: '', constraint: '', property: '' });
        }

        const user: Users = await this.validateUser(decoded);

        if (!user) {
            return this.responseService.error(HttpStatus.CONFLICT, 'User Unauthorized!', { value: '', constraint: '', property: '' });
        }

        return true;
    }

    // Custom Response User
    public responseUser(user?: any, data?: any) {
        return {
            ...user,
            setting: user.settings ?? [],
            profile: data.profile,
            age: data.age ?? 0,
            default: {
                account: { id: user.account[0].id, username: user.account[0].username, thumbnail: user.account[0].pic },
                profile: { id: data.profileId, username: data.profileName, thumbnail: data.thumbnail }
            }
        };
    }

    public generateOTP(min = 100000, max = 999999): Number {
        return Math.floor(
            Math.random() * (max - min) + min
        );
    }
}
