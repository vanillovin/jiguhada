import { useNavigate } from 'react-router-dom';

const Error = ({ message }: any) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-20">
      <h1>{message}</h1>
      <div className="mt-2">
        <button
          className="border rounded-full px-2 bg-amber-100 mr-2"
          onClick={() => navigate('/')}
        >
          홈으로 이동
        </button>
        <button
          className="border rounded-full px-2 bg-amber-200"
          onClick={() => navigate(-1)}
        >
          이전으로 이동
        </button>
      </div>
    </div>
  );
};

export default Error;
