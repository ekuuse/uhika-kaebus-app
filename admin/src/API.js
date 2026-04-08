const getApiBaseUrl = () => {
	if (import.meta.env.VITE_API_URL) {
		return import.meta.env.VITE_API_URL;
	}

	return "http://localhost:7007";
};

export const API_BASE_URL = getApiBaseUrl();