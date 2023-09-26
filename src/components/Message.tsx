import { Link } from 'react-router-dom';

export default function Message({
  message,
  navigateInfo: { name, path },
}: {
  message: string;
  navigateInfo: { name: string; path: string };
}) {
  return (
    <div className="mt-28 text-center">
      <p className="text-lg">{message}</p>
      <Link
        to={path}
        className="py-1 px-2 mt-2 border rounded-full hover:bg-jghd-blue hover:text-white"
      >
        {name}으로 이동하기
      </Link>
    </div>
  );
}
