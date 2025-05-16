import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class ProxyService {
  async forward(
    url: string,
    method: Method,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<any> {
    const response = await axios({
      url,
      method,
      data,
      headers,
    });
    return response.data;
  }
}
