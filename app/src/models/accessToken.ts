import { PoolClient } from 'pg';
import { pgClient } from '../database';

type AccessTokenType = {
  id?: number;
  token: string;
  expiration: Date;
  user_id: number;
};

class AccessToken {
  async withConnection<T>(
    callback: (connection: PoolClient) => Promise<T>
  ): Promise<T> {
    const connection = await pgClient.connect();
    try {
      return await callback(connection);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async createAccessToken(t: AccessTokenType): Promise<void> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO access_tokens (user_id, token, expiration) VALUES ($1, $2, $3)',
        values: [t.user_id, t.token, t.expiration]
      };
      await connection.query(query);
    });
  }
  async getAccessToken(user_id: number): Promise<string> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT token FROM access_tokens WHERE user_id=$1',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows[0].token;
    });
  }
  async deleteAccessToken(t: AccessTokenType): Promise<void> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM access_tokens WHERE user_id=$1 AND expiration <= $2',
        values: [t.user_id, t.expiration]
      };
      await connection.query(query);
    });
  }
}
export default AccessToken;
