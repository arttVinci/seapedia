# Before AI Polish

sekarang kita akan nge refactor di task 2 bagian hooks, service dan menghubungkan dengan api backend

nanti untu layering hooks itu akan

hooks/mutations // dsini untuk hooks seperti post, put, delete
hooks/queries // dsnii untuk hooks seperti get / query data

contoh : hooks/mutations/users // berarti dsini post put delete berkaitan dengan users

berikut contoh :
untuk mutations

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ####Service } from "@/services";

import { ApiError } from "@/api/apiError";

import type { Create####Request, ####Response } from "@/@types";

interface UseCreate#### {

  onSuccess?: (data: ####Response) => void;

  onError?: (error: ApiError) => void;

}

export const useCreate#### = (options?: UseCreate####) => {

  const queryClient = useQueryClient();

  return useMutation<####Response, ApiError, Create####Request>({

    mutationFn: (payload: Create####Request) =>

      ####Service.create(payload),

    onSuccess: (data) => {

      queryClient.invalidateQueries({ queryKey: ["####"] });

      options?.onSuccess?.(data);

    },

    onError: (error) => {

      options?.onError?.(error);

    },

  });

};

ingat ini hanya contoh / pola jangan di jadikan salinan/ copy paste

berikut untuk queries:

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { ####Response } from "@/@types";

import { ####Service } from "@/services";

import { ApiError } from "@/api/apiError";

import type { ApiResponse, SearchParams } from "@/@types/base/api.types";

interface Use#### extends SearchParams {

  enabled?: boolean;

  onSuccess?: (data: ####Response[]) => void;

  onError?: (error: ApiError) => void;

}

export const useAdmin#### = ({

  page = 1,

  size = 10,

  title = "",

}: Use####) => {

  return useQuery<ApiResponse<Achievement####[]>, ApiError>({

    queryKey: ["####", "admin", { page, size, title }],

    queryFn: () => ####Service.search({ page, size, title }),

    staleTime: 5 _ 60 _ 1000,

    retry: 1,

    placeholderData: keepPreviousData,

  });

};

berikut hanya contoh pola/flow jangan di jadikan salinan.

berikut contoh layer service :
import type {

  LoginUserRequest,

  LoginUserResponse,

  RegisterUserRequest,

  ApiResponse,

  UserResponse,

  SendOtpRequest,

  UpdateUserRequest,

} from "@/@types";

import type { AxiosResponse } from "axios";

import apiClient from "@/api/apiClient";

class AuthService {

  private readonly BASE_PATH = "/users";

  async currentUser(): Promise<UserResponse> {

    const response: AxiosResponse<ApiResponse<UserResponse>> =

      await apiClient.get(`${this.BASE_PATH}/_current`);

    return response.data.data;

  }

  async createUser(payload: RegisterUserRequest): Promise<LoginUserResponse> {

    const response: AxiosResponse<ApiResponse<LoginUserResponse>> =

      await apiClient.post(this.BASE_PATH, payload);

    return response.data.data;

  }

  async loginUser(payload: LoginUserRequest): Promise<LoginUserResponse> {

    const response: AxiosResponse<ApiResponse<LoginUserResponse>> =

      await apiClient.post(`${this.BASE_PATH}/_login`, payload);

    return response.data.data;

  }

  async logoutUser(): Promise<void> {

    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(

      this.BASE_PATH,

    );

    return response.data.data;

  }

  async updateUser(payload: UpdateUserRequest): Promise<UserResponse> {

    const response: AxiosResponse<ApiResponse<UserResponse>> =

      await apiClient.patch(`${this.BASE_PATH}/_current`, payload);

    return response.data.data;

  }

}

export default new AuthService();

berikut hanya contoh flow / pola jangan di jadikan salinan.

dsini kita akan bener2 uji coba (saya yang uji coba), langsung di localhost apakah api terpanggil dengan baik? atau tidak.

pastikan kamu refactor sesuai branch jangan melenceng tidak sesuai aturan.
jangan menumpuk banyak implementasi di 1 commit

untuk base url sudah saya kasih di .env dan sudah saya configurasi.

Tetap berpedoman pada docs/sdd.md (Bagian 2: Struktur Folder & Stack), .agent/AGENTS.md, dan skill terkait. Berdasarkan itu, susun rencana kerja TANPA menulis kode terlebih dahulu.

Rencana tersebut juga harus mencakup:

- Cara memenuhi Definition of Done untuk task ini

- Rencana branch & commit

Tunjukkan rencana tersebut ke saya dan tunggu persetujuan dari saya. JANGAN LANGUN IMPLEMENTASI TUNGGU SAYA APPROVE

# After AI Polish

Sekarang kita lanjut ke refactor Task 2, bagian hooks, service, dan koneksi ke API backend.

Untuk layering hooks, strukturnya akan seperti ini:

hooks/mutations // untuk hooks seperti post, put, delete

hooks/queries // untuk hooks seperti get / query data

Contoh: hooks/mutations/users — berarti di sini berisi post/put/delete yang berkaitan dengan users.

Berikut contoh pola untuk mutations:

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ####Service } from "@/services";

import { ApiError } from "@/api/apiError";

import type { Create####Request, ####Response } from "@/@types";

interface UseCreate#### {

onSuccess?: (data: ####Response) => void;

onError?: (error: ApiError) => void;

}

export const useCreate#### = (options?: UseCreate####) => {

const queryClient = useQueryClient();

return useMutation<####Response, ApiError, Create####Request>({

mutationFn: (payload: Create####Request) =>

####Service.create(payload),

onSuccess: (data) => {

queryClient.invalidateQueries({ queryKey: ["####"] });

options?.onSuccess?.(data);

},

onError: (error) => {

options?.onError?.(error);

},

});

};

Catatan: contoh di atas hanya ilustrasi pola, bukan untuk disalin langsung.

Berikut contoh pola untuk queries:

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { ####Response } from "@/@types";

import { ####Service } from "@/services";

import { ApiError } from "@/api/apiError";

import type { ApiResponse, SearchParams } from "@/@types/base/api.types";

interface Use#### extends SearchParams {

enabled?: boolean;

onSuccess?: (data: ####Response[]) => void;

onError?: (error: ApiError) => void;

}

export const useAdmin#### = ({

page = 1,

size = 10,

title = "",

}: Use####) => {

return useQuery<ApiResponse<Achievement####[]>, ApiError>({

queryKey: ["####", "admin", { page, size, title }],

queryFn: () => ####Service.search({ page, size, title }),

staleTime: 5 _ 60 _ 1000,

retry: 1,

placeholderData: keepPreviousData,

});

};

Catatan: contoh di atas hanya ilustrasi pola/flow, bukan untuk disalin langsung.

Berikut contoh pola untuk layer service:

import type {

LoginUserRequest,

LoginUserResponse,

RegisterUserRequest,

ApiResponse,

UserResponse,

SendOtpRequest,

UpdateUserRequest,

} from "@/@types";

import type { AxiosResponse } from "axios";

import apiClient from "@/api/apiClient";

class AuthService {

private readonly BASE_PATH = "/users";

async currentUser(): Promise<UserResponse> {

const response: AxiosResponse<ApiResponse<UserResponse>> =

await apiClient.get(`${this.BASE_PATH}/_current`);

return response.data.data;

}

async createUser(payload: RegisterUserRequest): Promise<LoginUserResponse> {

const response: AxiosResponse<ApiResponse<LoginUserResponse>> =

await apiClient.post(this.BASE_PATH, payload);

return response.data.data;

}

async loginUser(payload: LoginUserRequest): Promise<LoginUserResponse> {

const response: AxiosResponse<ApiResponse<LoginUserResponse>> =

await apiClient.post(`${this.BASE_PATH}/_login`, payload);

return response.data.data;

}

async logoutUser(): Promise<void> {

const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(

this.BASE_PATH,

);

return response.data.data;

}

async updateUser(payload: UpdateUserRequest): Promise<UserResponse> {

const response: AxiosResponse<ApiResponse<UserResponse>> =

await apiClient.patch(`${this.BASE_PATH}/_current`, payload);

return response.data.data;

}

}

export default new AuthService();

Catatan: contoh di atas hanya ilustrasi flow/pola, bukan untuk disalin langsung.

Untuk pengujian, nanti saya yang akan uji coba langsung di localhost — memastikan apakah API benar-benar terpanggil dengan baik atau tidak.

Beberapa hal yang wajib diperhatikan:

- Pastikan refactor dilakukan sesuai branch yang ditentukan, jangan melenceng dari aturan yang sudah ada.

- Jangan menumpuk banyak implementasi dalam satu commit.

- Base URL sudah disediakan dan dikonfigurasi di .env.
- Endpoint sesuai yang ada di backend / contract api

Tetap berpedoman pada docs/sdd.md (Bagian 2: Struktur Folder & Stack), .agent/AGENTS.md, dan skill terkait. Berdasarkan itu, susun rencana kerja TANPA menulis kode terlebih dahulu.

Rencana tersebut juga harus mencakup:

- Cara memenuhi Definition of Done untuk task ini

- Rencana branch & commit

Tunjukkan rencana tersebut ke saya dan tunggu persetujuan dari saya. JANGAN LANGSUNG IMPLEMENTASI, TUNGGU SAYA APPROVE.
