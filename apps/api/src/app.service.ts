import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      message: 'Tulana Darshaka API is running! 🚀',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      status: 'healthy',
      features: [
        'Product Management',
        'Comparison Engine',
        'Review System',
        'Search Functionality',
      ],
    };
  }
}
