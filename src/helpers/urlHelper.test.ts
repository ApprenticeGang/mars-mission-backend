import {buildUrl} from "./urlHelper";

const baseUrl = "http://nasa/api";

describe("The URL Helper", () => {
    it("Should handle paths without a leading slash", () => {
        const path = "path";
        
        const url = buildUrl(baseUrl, path);
        
        expect(url).toBe("http://nasa/api/path");
    });
    
    it("Should strip the path of leading slashes", () => {
        const path = "/path";

        const url = buildUrl(baseUrl, path);

        expect(url).toBe("http://nasa/api/path");
    });

    it("Should apply a single query parameters if one given", () => {
        const path = "/path";
        const queryParams = [
            { name: "api_key", value: "my-api-key" },
        ]

        const url = buildUrl(baseUrl, path, queryParams);

        expect(url).toBe("http://nasa/api/path?api_key=my-api-key");
    });

    it("Should apply multiple query parameters if many given", () => {
        const path = "/path";
        const queryParams = [
            { name: "sol", value: "100" },
            { name: "api_key", value: "my-api-key" },
        ]

        const url = buildUrl(baseUrl, path, queryParams);

        expect(url).toBe("http://nasa/api/path?sol=100&api_key=my-api-key");
    });
});