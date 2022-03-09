export interface CronAzureService {
  getAzureAccessToken: () => Promise<void>;
  getToken: () => string | undefined;
  handleCron(): Promise<void>;
}
