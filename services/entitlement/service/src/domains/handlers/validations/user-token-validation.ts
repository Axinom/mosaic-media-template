import { plainToClass } from 'class-transformer';
import jwt from 'jsonwebtoken';
// import { AuthToken, TokenValidationResult } from 'src/common/class-models/user-token';
import {
  AuthToken,
  getFullConfig,
  TokenValidationResult,
} from '../../../common';

const config = getFullConfig();
export class UserTokenValidation {
  private publicKey: any;
  private userToken: string;

  constructor(userToken: string) {
    // Load the public key from a file or environment variable
    // this.publicKey = fs.readFileSync('path_to_public_key.pem', 'utf8');

    try {
      this.publicKey = config.userSessionPublicKeyRSA;
    } catch (e) {
      console.error('Failed to decode Base64 string:', e);
      this.publicKey = '';
    }
    this.userToken = userToken;
  }

  getUserIdFromToken(): string | null {
    const validationResult = this.validateToken();
    return validationResult.token?.userId || null;
  }

  private validateToken(): TokenValidationResult {
    let authToken = null;

    try {
      authToken = plainToClass(
        AuthToken,
        jwt.verify(this.userToken, this.publicKey, {
          algorithms: ['RS256'],
        }),
      );
    } catch (ex) {
      console.debug(`Failed to decode token - user token. Error : ${ex}`);
      return { message: 'Invalid authentication token' };
    }

    if (!authToken || !authToken.userId) {
      console.trace(`Token or user ID in token is empty`);
      return { message: 'Missing session id' };
    }

    return { message: 'Token valid', token: authToken };
  }
}
