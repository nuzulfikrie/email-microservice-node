import { getRepository } from 'typeorm';
import { Blacklist } from '../models/Blacklist';

export class BlacklistService {
  private blacklistRepository = getRepository(Blacklist);

  async isBlacklisted(email: string): Promise<boolean> {
    const blacklistedEmail = await this.blacklistRepository.findOne({ where: { email } });
    return !!blacklistedEmail;
  }

  async addToBlacklist(email: string, reason?: string): Promise<Blacklist> {
    const blacklist = this.blacklistRepository.create({
      email,
      reason
    });
    return await this.blacklistRepository.save(blacklist);
  }

  async removeFromBlacklist(email: string): Promise<void> {
    await this.blacklistRepository.delete({ email });
  }

  async getBlacklist(): Promise<Blacklist[]> {
    return await this.blacklistRepository.find();
  }
} 