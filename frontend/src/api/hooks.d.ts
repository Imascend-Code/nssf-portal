export type Me = {
    id: number;
    email: string;
    full_name?: string | null;
    phone?: string | null;
    nssf_number?: string | null;
    balance?: number | string;
    role?: "PENSIONER" | "STAFF" | "ADMIN" | string;
    is_staff?: boolean;
    is_superuser?: boolean;
    date_joined?: string;
};
export type Paged<T> = {
    results?: T[];
    count?: number;
    next?: string | null;
    previous?: string | null;
} | T[];
export declare function useLogin(): import("@tanstack/react-query").UseMutationResult<Me, Error, {
    email: string;
    password: string;
}, unknown>;
export declare function useRegister(): import("@tanstack/react-query").UseMutationResult<Me, Error, {
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
}, unknown>;
/** One-time fetch if token exists but store has no user yet */
export declare function useMe(): import("@tanstack/react-query").UseQueryResult<Me, Error>;
export declare function useProfile(): import("@tanstack/react-query").UseQueryResult<Me, Error>;
export declare function useUpdateProfile(): import("@tanstack/react-query").UseMutationResult<any, Error, Partial<Pick<Me, "full_name" | "phone" | "nssf_number">> & {
    address?: string;
    city?: string;
    bank_name?: string;
    bank_account?: string;
}, unknown>;
export declare function useBeneficiaries(params?: Record<string, any>): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useAddBeneficiary(): import("@tanstack/react-query").UseMutationResult<any, Error, {
    full_name: string;
    relationship: string;
    percentage: number;
    phone?: string;
    national_id?: string;
}, unknown>;
export declare function usePayments(params?: Record<string, any>): import("@tanstack/react-query").UseQueryResult<any[], Error>;
export declare function useMyRequests(params?: Record<string, any>): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useCategories(): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useCreateRequest(): import("@tanstack/react-query").UseMutationResult<any, Error, {
    title: string;
    description: string;
    category: number;
    priority: string;
}, unknown>;
export declare function useUploadAttachment(requestId: number): import("@tanstack/react-query").UseMutationResult<any, Error, FormData, unknown>;
export declare function useReport(): import("@tanstack/react-query").UseQueryResult<any, any>;
