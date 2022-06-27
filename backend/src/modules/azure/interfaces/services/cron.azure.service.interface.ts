export interface CronAzureService {
  getAzureAccessToken: () => Promise<string>;
}
