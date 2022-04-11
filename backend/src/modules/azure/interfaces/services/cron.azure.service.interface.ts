export interface CronAzureService {
  getAzureAccessToken: () => Promise<string>;
  getToken: () => string | undefined;
  handleCron(): Promise<void>;
}
