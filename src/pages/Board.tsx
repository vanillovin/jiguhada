import React from 'react';
import { AiOutlineEye, AiOutlineLike } from 'react-icons/ai';

function Board() {
  return (
    <section className="w-full max-w-6xl px-10">
      <div className="bg-gray-2 text-start p-6">
        <h1 className="font-bold text-2xl">이야기를 나눠요</h1>
        <p>카테고리의 성격에 맞는 게시글을 작성해주세요 {':>'}</p>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <ul className="flex flex-row md:flex-col border items-start md:p-5 md:h-44 md:mr-5">
          <li>전체</li>
          <li>자유</li>
          <li>비건</li>
          <li>환경</li>
          <li>Q{'&'}A</li>
        </ul>

        <div className="flex flex-col flex-1 items-start">
          <form
            className="flex w-full mb-4"
            onSubmit={() => console.log('onSubmit!')}
          >
            <select defaultValue="title?" className="border border-r-0 pl-2">
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="author">작성자</option>
            </select>
            <input
              className="w-full p-2 outline-none border border-l-0 mr-2"
              placeholder="검색어를 입력해 주세요!"
            />
            <button className="bg-gray-2 w-24">검색</button>
          </form>

          <ul className="ml-1 mb-4 flex items-center">
            <li>최신순</li>|<li>인기순</li>|<li>조회순</li>
          </ul>

          <ul className="w-full">
            <li className="w-full flex items-center py-2 border-b text-sm md:text-base font-semibold">
              <p className="w-1/12 text-center">글번호</p>
              <p className="w-5/12 text-center">제목</p>
              <p className="w-2/12 text-center">글쓴이</p>
              <p className="w-2/12 text-center">작성일</p>
              <p className="w-1/12 text-center">조회수</p>
              <p className="w-1/12 text-center">좋아요수</p>
            </li>
            {/* {boardList.map()} */}
            <li className="w-full flex items-center py-3 border-b text-sm md:text-base">
              <p className="w-1/12 text-center font-medium">{'10001'}</p>
              <p className="w-5/12 leading-5">
                [{'category'}]
                {'가나다라마바사아자차카타파하가나다라마바사아자차카타파하'}
              </p>
              <p className="w-2/12 text-center">{'그을쓰으니이이잉'}</p>
              <p className="w-2/12 text-center tracking-tighter text-gray-4">
                {'2022-09-19 10:26'}
              </p>
              <p className="w-1/12 flex items-center justify-center">
                <AiOutlineLike size={15} />{' '}
                <span className="ml-1 text-gray-4">{'1000'}</span>
              </p>
              <p className="w-1/12 flex items-center justify-center">
                <AiOutlineEye size={15} />{' '}
                <span className="ml-1 text-gray-4">{'104'}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Board;
