import WebApp from '@twa-dev/sdk';
import { getCurrentDemoUser } from '@/utils/demoUsers';

const isDevMode = (): boolean => {
  return import.meta.env.VITE_DEV_MODE === 'true' || WebApp.initDataUnsafe.start_param === 'debug';
};

const shouldUseDemoAuth = (): boolean => {
  return isDevMode() && !WebApp.initData?.trim();
};

class ApiClient {
  #apiURL: string = import.meta.env.VITE_BACKEND_URL;

  async do(method: string, path: string, body?: object): Promise<Response> {
    let jsonBody = null;
    if (body) {
      jsonBody = JSON.stringify(body);
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const headers: HeadersInit = body ? { 'Content-Type': 'application/json' } : {};

    // Для демо-режима добавляем заголовок X-Api-Token
    if (shouldUseDemoAuth()) {
      // Если в DEV режиме или демо-режиме и не в Telegram, используем тестовый токен
      headers['X-Api-Token'] = JSON.stringify(getCurrentDemoUser());
    } else {
      headers.Authorization = `tma ${WebApp.initData}`;
    }

    const resp = await fetch(`${this.#apiURL}${path}`, {
      method: method,
      body: jsonBody,
      headers: headers,
    });

    if (!resp.ok) {
      let errorMessage = `Expected 2xx response for ${path}, but got: ${resp.status}`;

      try {
        const errorData = await resp.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Если не удалось распарсить JSON, используем стандартное сообщение
      }

      throw new Error(errorMessage);
    }

    return resp;
  }

  async get<T extends object>(path: string, params?: object): Promise<T> {
    const queryParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        queryParams.append(key, value);
      }
    }

    const resp = await this.do('GET', params ? `${path}?${queryParams}` : path);
    return resp.json();
  }

  async post<T extends object>(path: string, body?: object): Promise<T> {
    const resp = await this.do('POST', path, body);
    return resp.json();
  }

  async put<T extends object>(path: string, body?: object): Promise<T> {
    const resp = await this.do('PUT', path, body);
    return resp.json();
  }

  async patch<T extends object>(path: string, body?: object): Promise<T> {
    const resp = await this.do('PATCH', path, body);
    return resp.json();
  }

  async delete(path: string, body?: object): Promise<Response> {
    return await this.do('DELETE', path, body);
  }
}

export const apiClient = new ApiClient();
