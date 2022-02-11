export interface UpdateUserService {
  setCurrentRefreshToken(refreshToken: string, userId: string): Promise<void>;
}
