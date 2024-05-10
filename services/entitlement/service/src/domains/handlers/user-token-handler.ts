import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthToken extends JwtPayload {
  UserId?: string; // Adjust types according to the actual token structure
}

interface TokenValidationResult {
  message: string;
  token?: AuthToken;
}

export class UserTokenHandler {
  private publicKey: string;
  private userToken: string;

  constructor(userToken: string) {
    // Load the public key from a file or environment variable
    // this.publicKey = fs.readFileSync('path_to_public_key.pem', 'utf8');
    this.publicKey = process.env.PUBLIC_KEY || '';
    this.userToken = userToken;
  }

  getUserIdFromToken(): string | null {
    const validationResult = this.validateToken();
    return validationResult.token?.UserId || null;
  }

  private validateToken(): TokenValidationResult {
    let token: AuthToken | null = null;

    try {
      token = jwt.verify(this.userToken, this.publicKey, {
        algorithms: ['RS256'],
      }) as AuthToken;
    } catch (ex) {
      console.debug(`Failed to decode token - user token. Error : ${ex}`);
      return { message: 'Invalid authentication token' };
    }

    if (!token || !token.UserId) {
      console.trace(`Token or user ID in token is empty`);
      return { message: 'Missing session id' };
    }

    return { message: 'Token valid', token };
  }
}
