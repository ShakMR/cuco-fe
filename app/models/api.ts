export enum MethodEnum {
  GET = "GET",
  POST = "POST",
}

type QueryParams = {
  [key: string]: string;
};

type Body = {
  [key: string]: Body | string | number | boolean;
};

type FetchOptions = {
  body?: Body;
  method?: MethodEnum;
  baseURI?: string;
  queryParams?: QueryParams;
  authorization?: string;
};

type ErrorResponse = {
  reason: string;
  originalError: Error;
};

type NonErrorResponse = {
  error: false;
};

export async function fetchAPI<ReturnT>(
  url: string,
  options: FetchOptions
): Promise<{ data?: ReturnT; error?: ErrorResponse }> {
  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    if (options.authorization) {
      headers.set("Authorization", `Bearer ${options.authorization}`);
    }

    const res = await fetch(buildURL(url, options.queryParams).toString(), {
      method: options.method || MethodEnum.GET,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers,
    });

    if (res.ok) {
      return res.status !== 204 ? await res.json() : { data: {} };
    }

    const body = await res.json();
    return {
      error: {
        reason: body.message || body.details,
        originalError: body,
      },
    };
  } catch (err) {
    return {
      error: {
        originalError: err as Error,
        reason: "unknown",
      },
    };
  }
}

function buildURL(uri: string, queryParams: QueryParams = {}): URL {
  const baseAPI = uri.includes("http") ? uri : `${process.env.API_URL}${uri}`;
  const url = new URL(baseAPI);

  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value);
  }

  return url;
}
