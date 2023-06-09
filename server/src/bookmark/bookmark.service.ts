import { Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { BookmarkWithType } from './bookmark.controller';

//import iconv from 'iconv-lite';
const DEFAULT_IMAGE = 'http://localhost:4000/images/default.jpg';

interface PageData {
  url?: string;
  type?: string;
  image?: string;
  alt?: string;
  width?: string;
  height?: string;
  locale?: string;
  site_name?: string;
  title?: string;
  description?: string;
  faviconUrl?: string;
}

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {
    // prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('BookmarkQuery: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
  }

  async getBookmark(userName): Promise<Bookmark[] | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });

    return this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        orderId: 'asc',
      },
    });
  }

  async checkUrl(user: User, url: string) {
    if (!url) return;
    try {
      return await getPageInfo(url);
    } catch (err) {
      console.log(err);
    }
  }

  async createBookmark(user: User, bookmarkDto: BookmarkDto) {
    const { title, description, imageUrl, faviconUrl, url } = bookmarkDto;
    const folder = await this.prisma.folder.findFirst({
      where: {
        userId: user.id,
      },
      select: { id: true },
    });

    try {
      const res = await this.prisma.bookmark.create({
        data: {
          url,
          title: title,
          description: description,
          imageUrl: imageUrl ?? DEFAULT_IMAGE,
          userId: user.id,
          faviconUrl,
          folderId: folder.id,
        },
      });

      return this.prisma.bookmark.update({
        where: {
          id: res.id,
        },
        data: {
          orderId: res.id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateBookmark(user: User, bookmark: BookmarkWithType, id: number) {
    const { title, description, imageUrl, faviconUrl, url, folderId, orderId, type } = bookmark;
    console.log(type);
    if (type === 'order') {
      try {
        //파라미터로 받은 교체전 id

        const originData = await this.prisma.bookmark.findUnique({
          where: { id: id },
        });

        //파라미터로 받은 교체할 id
        const replaceData = await this.prisma.bookmark.findFirst({
          where: { orderId: orderId },
        });

        //originData의 orderId를 replaceData.orderId로 교체
        await this.prisma.bookmark.update({
          where: {
            id: replaceData.id,
          },
          data: {
            orderId: originData.orderId,
          },
        });

        console.log('orderId', orderId);

        console.log('originData', originData.orderId, 'replaceData', replaceData.orderId);

        //replaceData의 orderId를 originData.orderId로 교체
        return this.prisma.bookmark.update({
          where: { id },
          data: { title, description, imageUrl, faviconUrl, url, folderId, orderId },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        return await this.prisma.bookmark.update({
          where: { id },
          data: { title, description, imageUrl, faviconUrl, url, folderId },
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async deleteBookmark(user: User, id: number) {
    console.log(id);
    try {
      return this.prisma.bookmark.delete({
        where: { id },
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const getPageInfo = async (url: string) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        Accept: 'text/html,*/*',
      },
    });

    const $ = cheerio.load(html);
    const ogTags: PageData = {};
    const faviconTags: string[] = [];

    const head = $('head');

    // og 태그 파싱
    head.find('meta').each((index, element) => {
      const property = $(element).attr('property');
      if (property?.startsWith('og:')) {
        const key = property.replace('og:', '');
        ogTags[key] = $(element).attr('content');
      }
    });

    // favicon 태그 파싱
    head.find('link').each((index, element) => {
      const rel = $(element).attr('rel');
      if (rel === 'shortcut icon' || rel === 'icon') {
        // href 속성에서 URL 절대경로로 바꾸기
        const href = $(element).attr('href');
        const hrefUrl = new URL(href, url).href;
        faviconTags.push(hrefUrl);
      }
    });

    if (!ogTags.title) {
      ogTags.title = head.find('title').text();
    }

    if (!ogTags.description) {
      ogTags.description = head.find('meta[name="description"]').attr('content');
    }

    return {
      ...ogTags,
      faviconUrl: faviconTags[0],
    };
  } catch (err) {
    console.log(err);
  }
};
