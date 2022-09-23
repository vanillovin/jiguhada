import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { FiBookmark } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import { useLocation, useParams } from 'react-router-dom';
import { defaultProfileImage } from './Register';
import { useQuery } from 'react-query';
import { getBoardDetail } from '../modules/board/api';
import { getBoardCatText, getDateText } from '../utils';
import { Category } from '../modules/board/type';
import { marked } from 'marked';

function BoardDetail() {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(`BoardDetail${id || state}`, () =>
    getBoardDetail(Number(id) || Number(state))
  );
  console.log('BoardDetail data', data);

  return (
    <section className="w-full max-h-screen max-w-6xl px-10">
      <div className="bd-container flex flex-col md:flex-row w-full border rounded-sm">
        {/* left */}
        <div className="flex flex-col w-full md:w-3/5 h-full border-b md:border-r ">
          {/* left top */}
          <div className="w-full flex flex-col md:flex-row border-b p-3">
            <div className="flex items-center mb-1 md:items-start md:flex-col mr-3 md:mb-0">
              <h2 className="text-sm md:text-base font-medium">{id}</h2>
              <h3 className="text-sm text-gray-4 mt-0 ml-1 md:mt-1 md:ml-0">
                {/* {getBoardCatText(data?.boardCategory as Category)} */}
                자유게시판
              </h3>
            </div>
            <div className="flex flex-col justify-between">
              <h1 className="font-semibold md:text-lg">{data?.title}</h1>
              <h2 className="flex items-center text-sm md:text-base">
                {data?.nickname} ·{' '}
                <span className="ml-1 text-gray-3 text-xs">
                  {getDateText(data?.createDate as string)}
                </span>
              </h2>
            </div>
          </div>
          {/* left bot */}
          <div
            className="bd-content w-full h-full px-3 pt-4 pb-7 scroll-smooth overflow-auto bg-gray-1 text-sm md:text-base leading-6 md:leading-7"
            dangerouslySetInnerHTML={{
              __html: marked(data ? data.content : ''),
            }}
          />
        </div>

        {/* right */}
        <div className="w-full md:w-2/5 h-full flex flex-col justify-between">
          <div className="p-3">
            <p className="mb-2 text-sm md:text-base">
              댓글수 {data?.commentList.length}개
            </p>
            <ul>
              <li className="flex items-center">
                <div className="w-10 h-10 mr-2">
                  <img
                    src={defaultProfileImage}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium">
                    지구님
                    <span className="ml-1 text-gray-3 text-xs">
                      2022.09.21 20:56
                    </span>
                  </p>
                  <p className="text-sm md:text-base">{'안녕하세요구르트'}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center py-2 px-3 border-t">
              <button className="flex items-center mr-6">
                {true ? (
                  <AiOutlineHeart size={22} />
                ) : (
                  <AiFillHeart size={22} />
                )}
                <span className="ml-1">0</span>
              </button>
              <button className="flex items-center mr-6">
                <AiOutlineComment size={22} /> <span className="ml-1">1</span>
              </button>
              <button className="">
                {true ? <FiBookmark size={22} /> : <BsBookmarkFill />}
              </button>
            </div>
            <form
              className="flex items-center border-t"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input className="outline-none flex-1 py-2 px-3" />
              <button
                type="submit"
                className={`py-1 px-3 ${true ? 'text-jghd-green' : ''}`}
              >
                입력
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoardDetail;
