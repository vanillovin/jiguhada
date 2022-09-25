import { useNavigate } from 'react-router-dom';

export default function Message({
  message,
  navigateInfo: { name, path },
}: {
  message: string;
  navigateInfo: { name: string; path: string };
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-28 text-center">
      <p className="text-lg">{message}</p>
      <button
        onClick={() => navigate(`/${path}`)}
        className="py-1 px-2 mt-2 bg-jghd-blue text-white rounded-sm"
      >
        {name}으로 이동하기
      </button>
    </div>
  );
}
