export interface CreateResetTokenAuthApplication {
  create(emailAddress: string): Promise<{
    message: string;
  }>;
}
