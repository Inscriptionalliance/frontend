import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
} from "axios"; // -xios-ode_modules/axios/index.ts-
import { Decrypt, Encrypt } from "../utils/encryption";
import i18n from "i18next";
import store from "../store";
import { json } from "stream/consumers";
class HttpRequest {
  // --xios-
  constructor(public baseUrl: string) {
    // --
    this.baseUrl = baseUrl;
  }
  public request(options: AxiosRequestConfig): AxiosPromise {
    // --xiosPromise
    const instance: AxiosInstance = axios.create(); // -xios.create-xios---
    options = this.mergeConfig(options); // --rl、-
    try {
      this.interceptors(instance, options.url);
    } catch (error: any) {} // -nterceptors-
    return instance(options); // -xiosPromise
  }
  private interceptors(instance: AxiosInstance, url?: string) {
    // -
    // -
    try {
      instance?.interceptors?.request?.use(
        (config: AxiosRequestConfig) => {
          // config.headers.lang = 'en'
          if (
            (config.method === "POST" || config.method === "post") &&
            config?.data?.Encrypt
          ) {
            config.data = Encrypt(JSON.stringify(config?.data));
          }
          // config.data=Encrypt(JSON.stringify(config.data))
          // --onfig--xiosRequestConfig，-
          // --axios.defaults -
          return config;
        },
        (error) => {
          return Promise?.reject(error);
        }
      );
    } catch (error: any) {}

    try {
      instance?.interceptors?.response?.use(
        (res: AxiosResponse) => {
          // const { data } = res // res-xiosResponse<any>，--ata-
          // const { code, msg } = data // ---
          // if (code !== 0) { // -
          //   console.error(msg) // -，--I--
          // }
          if (typeof res.data === "string") {
            return Decrypt(res.data as unknown as string); // -
          } else {
            return res.data;
          }
        },
        (error) => {
          // -
          return Promise?.reject(error);
        }
      );
    } catch (error: any) {}
  }
  private mergeConfig(options: AxiosRequestConfig): AxiosRequestConfig {
    // -
    let state = store.getState();
    return Object.assign(
      {
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: state.token,
          lang: i18n.language === "zh" ? "zh" : "en",
        },
      },
      options
    );
  }
}
export default HttpRequest;
