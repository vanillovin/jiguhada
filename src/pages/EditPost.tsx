import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { currentUserState } from '../modules/user/atom';
import {
  getPrevPostDataRequest,
  updatePostRequest,
  uploadImgRequest,
} from '../modules/board/api';
import { Img } from '../modules/board/type';

interface LocationState {
  prevBoardData: {
    boardId: number;
    title: string;
    boardCategory: string;
    content: string;
  };
}

export default function EditPost() {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const boardId = Number(location.pathname.split('/')[2]);

  let tempImgList: Img[] = [];
  let contentImgList: Img[] = [];
  const editorRef = useRef<ToastEditor>(null);
  const currentUser = useRecoilValue(currentUserState);
  // const resetUser = useResetRecoilState(currentUserState);
  const navigate = useNavigate();

  useEffect(() => {
    getPrevPostDataRequest(
      currentUser?.accessToken as string,
      boardId // || editData.boardId
    )
      .then((res) => {
        console.log('getPrevBoardDataRequest res', res);
        if (res.errorCode === 'EXPIRE_ACCESS_TOKEN') {
          alert(res.message);
          navigate('/register', {
            state: { prevPath: location.pathname },
          });
          return;
        }
        // setEditData(res);
        contentImgList = res.imgList;
        tempImgList = res.imgList;
        editorRef.current?.getInstance().setHTML(res.content);
      })
      .catch((err) => {
        console.log('getPrevBoardDataRequest err', err);
      });
  }, []);

  const onChange = () => {
    const data = editorRef.current?.getInstance().getHTML();
    contentImgList = tempImgList.filter(({ imgUrl }) => data?.includes(imgUrl));
  };

  const onUploadImage = async (blob: Blob, callback: any) => {
    if (contentImgList.length >= 3) {
      alert('이미지 파일은 3개까지 첨부할 수 있습니다');
      return;
    }
    const formData = new FormData();
    formData.append('imgFile', blob);
    uploadImgRequest(formData)
      .then((data) => {
        // console.log('onUploadImage data', data);
        contentImgList.push({ imgId: 0, imgUrl: data.imgUrl });
        tempImgList.push({ imgId: 0, imgUrl: data.imgUrl });
        callback(data.imgUrl);
      })
      .catch((err) => {
        console.log('uploadImgRequest err', err);
      });
  };

  const handleCreateBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const instance = editorRef.current?.getInstance();
    const content = instance?.getHTML() as string;
    if (!formData.get('boardCategory')) {
      alert('카테고리를 선택해 주세요');
      return;
    }
    if (!formData.get('title')) {
      alert('제목을 입력해 주세요');
      return;
    }
    if (
      content === '<p><br></p>' ||
      content.split('<p>')[1].trim().length < 8
    ) {
      alert('내용은 4자 이상 입력해 주세요');
      return;
    }
    const boardImg = tempImgList.filter(({ imgUrl }) =>
      content?.includes(imgUrl)
    );
    const boardImgUrls = boardImg.map(({ imgUrl }) => imgUrl);
    const deleteImg = tempImgList.filter(
      ({ imgUrl }) => !boardImgUrls.includes(imgUrl)
    );
    const newData = {
      ...data,
      boardId,
      content,
      boardImg,
      deleteImg,
    };
    updatePostRequest(currentUser?.accessToken as string, newData)
      .then((res) => {
        console.log('updateBoardRequest res', res);
        const errorCode = res.errorCode || '';
        if (!errorCode) {
          navigate(`/board/${res.boardId}`);
        } else {
          alert(res.message);
          // resetUser();
          // navigate('/register', { state: { prevPath: location.pathname } });
        }
      })
      .catch((err) => {
        console.log('updateBoardRequest err', err);
      });
  };

  return (
    <form onSubmit={handleCreateBoard} className="w-screen max-w-4xl p-4">
      <div className="flex w-full text-start border-b border-gray-300 mb-4">
        <select
          name="boardCategory"
          defaultValue={locationState.prevBoardData.boardCategory}
          className="outline-none p-2"
        >
          <option value="">카테고리 선택</option>
          <option value="VEGAN">비건</option>
          <option value="ENVIRONMENT">환경</option>
          <option value="QUESTION">Q&A</option>
          <option value="FREE">자유게시판</option>
        </select>
        <input
          defaultValue={locationState.prevBoardData.title}
          name="title"
          className="outline-none p-2 flex-grow"
          placeholder="글 제목을 입력해 주세요"
        />
      </div>
      <ToastEditor
        initialValue={locationState.prevBoardData.content}
        ref={editorRef}
        useCommandShortcut={true}
        placeholder="내용을 입력해 주세요!"
        previewStyle="vertical"
        height="500px"
        initialEditType="wysiwyg"
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'indent', 'outdent'],
          ['table', 'image', 'link'],
        ]}
        onChange={onChange}
        plugins={[colorSyntax]}
        language="ko-KR"
        hooks={{ addImageBlobHook: onUploadImage }}
        hideModeSwitch={true}
      />
      <div className="text-end mt-4">
        <button className="rounded-md font-medium text-white py-1 px-4 tracking-wider bg-jghd-green ml-2">
          취소
        </button>
        <button
          type="submit"
          className="rounded-md font-medium text-white py-1 px-4 tracking-wider bg-jghd-blue ml-2"
        >
          등록
        </button>
      </div>
    </form>
  );
}