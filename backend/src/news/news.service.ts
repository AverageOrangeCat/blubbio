import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NewsGateway } from "./news.gateway";

@Injectable()
export class NewsService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => NewsGateway))
        private newsGateway: NewsGateway,
    ) { }

    async createNews(type: string, sprintMods: string[], userId: number, rank: number, value: number): Promise<any> {
        const newsEntry = await this.prisma.news.create({
            data: {
                type: type,
                mods: JSON.stringify(sprintMods),
                userId: userId,
                rank: rank,
                value: value,
            },
        });
        await this.updateNews();
        return newsEntry;
    }

    async getNewestNews(): Promise<NewsData[]>  {
        return this.prisma.news.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            include: {
                user: {
                    select: {
                        username: true,
                        pbUrl: true,
                    },
                },
            },
        }).then(newsEntries => 
            newsEntries.map(entry => ({
                ...entry,
                username: entry.user.username,
                userImg: entry.user.pbUrl,
            }))
        );
    }

    async updateNews(): Promise<void> {
        const latestNews = await this.getNewestNews();
        this.newsGateway.server.emit('updateNews', latestNews);
    }
}
