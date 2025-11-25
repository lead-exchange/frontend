class ApiClient {
  #apiURL: string = import.meta.env.VITE_BACKEND_URL + '/api';

  async do(method: string, path: string, body?: object): Promise<Response> {
    let jsonBody = null;
    if (body) {
      jsonBody = JSON.stringify(body);
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    return await fetch(`${this.#apiURL}${path}`, {
      method: method,
      body: jsonBody,
      headers: body && { 'Content-Type': 'application/json' },
    });
  }

  async get<T extends object>(path: string, params?: object): Promise<T> {
    const queryParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        queryParams.append(key, value);
      }
    }

    const resp = await this.do('GET', `${path}?${queryParams}`);
    return resp.json();
  }

  async post(path: string, body?: object): Promise<Response> {
    return await this.do('POST', path, body);
  }

  async put(path: string, body?: object): Promise<Response> {
    return await this.do('PUT', path, body);
  }

  async delete(path: string, body?: object): Promise<Response> {
    return await this.do('DELETE', path, body);
  }
}

export const apiClient = new ApiClient();
