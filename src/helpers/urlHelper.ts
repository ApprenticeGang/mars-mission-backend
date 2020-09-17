export interface QueryParameter {
    name: string;
    value: string;
}

export const buildUrl = (baseUrl: string, path: string, queryParameters: QueryParameter[] = []): string => {
    if (path.startsWith('/')) {
        path = path.slice(1);    
    }
    
    if (queryParameters.length === 0) {
        return `${baseUrl}/${path}`;
    }
     
    const queryString = queryParameters
        .map(param => `${param.name}=${param.value}`)
        .join("&");
    
    return `${baseUrl}/${path}?${queryString}`;
}