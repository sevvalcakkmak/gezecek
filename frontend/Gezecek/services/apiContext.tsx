import React, { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import { apiClient, ApiError } from './api';

// API State Types
interface ApiState {
    isLoading: boolean;
    error: ApiError | null;
    isOnline: boolean;
    requestCount: number;
}

interface ApiContextValue extends ApiState {
    // State management
    setLoading: (loading: boolean) => void;
    setError: (error: ApiError | null) => void;
    setOnlineStatus: (isOnline: boolean) => void;
    clearError: () => void;

    // API methods with state management
    request: <T>(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: string,
        data?: any,
        options?: {
            showLoading?: boolean;
            showError?: boolean;
            onSuccess?: (data: T) => void;
            onError?: (error: ApiError) => void;
        }
    ) => Promise<T>;
}

// Action Types
type ApiAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: ApiError | null }
    | { type: 'SET_ONLINE_STATUS'; payload: boolean }
    | { type: 'INCREMENT_REQUEST_COUNT' }
    | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: ApiState = {
    isLoading: false,
    error: null,
    isOnline: true,
    requestCount: 0,
};

// Reducer
function apiReducer(state: ApiState, action: ApiAction): ApiState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_ONLINE_STATUS':
            return { ...state, isOnline: action.payload };
        case 'INCREMENT_REQUEST_COUNT':
            return { ...state, requestCount: state.requestCount + 1 };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

// Context
const ApiContext = createContext<ApiContextValue | undefined>(undefined);

// Provider Props
interface ApiProviderProps {
    children: ReactNode;
    baseURL?: string;
}

// Provider Component
export function ApiProvider({ children, baseURL }: ApiProviderProps) {
    const [state, dispatch] = useReducer(apiReducer, initialState);

    // Set base URL if provided
    React.useEffect(() => {
        if (baseURL) {
            apiClient.setBaseURL(baseURL);
        }
    }, [baseURL]);

    // State management functions
    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error: ApiError | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    const setOnlineStatus = useCallback((isOnline: boolean) => {
        dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Enhanced request method with state management
    const request = useCallback(function <T>(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: string,
        data?: any,
        options: {
            showLoading?: boolean;
            showError?: boolean;
            onSuccess?: (data: T) => void;
            onError?: (error: ApiError) => void;
        } = {}
    ): Promise<T> {
        return (async () => {
            const {
                showLoading = true,
                showError = true,
                onSuccess,
                onError,
            } = options;

            try {
                if (showLoading) {
                    setLoading(true);
                }

                dispatch({ type: 'INCREMENT_REQUEST_COUNT' });

                let result;
                switch (method) {
                    case 'get':
                        result = await apiClient.get<T>(url);
                        break;
                    case 'post':
                        result = await apiClient.post<T>(url, data);
                        break;
                    case 'put':
                        result = await apiClient.put<T>(url, data);
                        break;
                    case 'patch':
                        result = await apiClient.patch<T>(url, data);
                        break;
                    case 'delete':
                        result = await apiClient.delete<T>(url);
                        break;
                    default:
                        throw new Error(`Unsupported method: ${method}`);
                }

                if (showLoading) {
                    setLoading(false);
                }

                if (showError) {
                    clearError();
                }

                onSuccess?.(result.data);
                return result.data;
            } catch (error) {
                const apiError = error as ApiError;

                if (showLoading) {
                    setLoading(false);
                }

                if (showError) {
                    setError(apiError);
                }

                onError?.(apiError);
                throw apiError;
            }
        })();
    }, [setLoading, setError, clearError]);

    const contextValue: ApiContextValue = {
        ...state,
        setLoading,
        setError,
        setOnlineStatus,
        clearError,
        request,
    };

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
}

// Hook to use API context
export function useApi(): ApiContextValue {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
}

// Convenience hooks for specific operations
export function useApiState() {
    const { isLoading, error, isOnline, requestCount } = useApi();
    return { isLoading, error, isOnline, requestCount };
}

export function useApiRequest() {
    const { request } = useApi();
    return request;
}

export function useApiError() {
    const { error, setError, clearError } = useApi();
    return { error, setError, clearError };
}