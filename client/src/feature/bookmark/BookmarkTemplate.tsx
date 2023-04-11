import Image from 'next/image';
import { Bookmark } from '@/types/Bookmark';

export default function BookmarkTemplate({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <div>
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id}>
          <p>{bookmark.title}</p>
          <Image width={300} height={300} src={bookmark.imageUrl} alt={bookmark.title} />
          <p>{bookmark.description}</p>
          <p>{bookmark.createdAt.toString()}</p>
        </div>
      ))}
    </div>
  );
}
