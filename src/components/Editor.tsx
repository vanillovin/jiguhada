import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import React, { useRef } from 'react';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { currentUserState } from '../modules/user/atom';
import { createBoardRequest, uploadImgRequest } from '../modules/board/api';

export default function Editor() {
  let imgList: string[] = []; // 에디터
  let tempImgList: string[] = []; // 전부
  const editorRef = useRef<ToastEditor>(null);
  const currentUser = useRecoilValue(currentUserState);
  const resetUser = useResetRecoilState(currentUserState);
  const navigate = useNavigate();

  const onChange = () => {
    const data = editorRef.current?.getInstance().getHTML();
    imgList = tempImgList.filter((img) => data?.includes(img));
  };

  const onUploadImage = async (blob: Blob, callback: any) => {
    if (imgList.length >= 3) {
      alert('이미지 파일은 3개까지 첨부할 수 있습니다');
      return;
    }
    const formData = new FormData();
    formData.append('imgFile', blob);
    uploadImgRequest(formData)
      .then((data) => {
        console.log('onUploadImage data', data);
        imgList.push(data.imgUrl);
        tempImgList.push(data.imgUrl);
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
    if (!formData.get('category')) {
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
    const imgList = tempImgList.filter((img) => content?.includes(img));
    const deletedImgList = tempImgList.filter((img) => !imgList.includes(img));
    const newData = {
      ...data,
      imgList,
      content,
      deletedImgList,
    };
    createBoardRequest(currentUser?.accessToken as string, newData)
      .then((res) => {
        console.log('createBoardRequest res', res);
        if (!res.errorCode) {
          navigate(`/board/${res.boardId}`);
        } else {
          alert(res.message);
          resetUser();
          navigate('/register');
        }
      })
      .catch((err) => {
        console.log('createBoardRequest err', err);
      });
  };

  return (
    <form onSubmit={handleCreateBoard} className="w-screen max-w-4xl p-4">
      <div className="flex w-full text-start border-b border-gray-300 mb-4">
        <select name="category" className="outline-none p-2">
          <option value="">카테고리 선택</option>
          <option value="VEGAN">비건</option>
          <option value="ENVIRONMENT">환경</option>
          <option value="QUESTION">Q&A</option>
          <option value="FREE">자유게시판</option>
        </select>
        <input
          name="title"
          className="outline-none p-2 flex-grow"
          placeholder="글 제목을 입력해 주세요"
        />
      </div>
      <ToastEditor
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
