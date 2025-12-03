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

    const resp = await fetch(`${this.#apiURL}${path}`, {
      method: method,
      body: jsonBody,
      headers: body && { 'Content-Type': 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`Expected 2xx response for ${path}, but got: ${resp.status}`);
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

  async put(path: string, body?: object): Promise<Response> {
    return await this.do('PUT', path, body);
  }

  async delete(path: string, body?: object): Promise<Response> {
    return await this.do('DELETE', path, body);
  }
}

export const apiClient = new ApiClient();
