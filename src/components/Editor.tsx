import { useRecoilState } from 'recoil';
import React, { useRef, useState } from 'react';
// https://github.com/nhn/tui.editor/tree/master/apps/react-editor
// editor
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
// color-syntax
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { Img } from '../modules/board/api';
import { currentUserState } from '../modules/user/atom';

export default function Editor() {
  const catRef = useRef() as React.RefObject<HTMLSelectElement>;
  const titRef = useRef() as React.RefObject<HTMLInputElement>;
  const editorRef = useRef<ToastEditor>(null);
  const [imgList, setImgList] = useState<Img[]>([]);
  const currentUser = useRecoilState(currentUserState);

  const onChange = () => {
    const data = editorRef.current?.getInstance().getHTML();
  };

  const onUploadImage = async (blob: Blob, callback: any) => {
    // console.log('onUploadImage blob', typeof blob, blob);
    // const formData = new FormData();
    // formData.append('imgFile', blob);
    // callback('url');
  };

  const handleCreateBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('tit-input'));
    const data = Object.fromEntries(formData);
    console.log('data', data);
    const instance = editorRef.current?.getInstance();
    const content = instance?.getHTML();
    const newData = {
      ...data,
      imgList,
      content,
    };
    console.log('newData:', newData);
    // category: 'free';
    // content: '<p>본문!</p>';
    // imgList: [];
    // title: '제목';
  };

  return (
    <form onSubmit={handleCreateBoard} className="w-screen max-w-4xl p-4">
      <div className="flex w-full text-start border-b border-gray-300 mb-4">
        <select name="category" className="outline-none p-2">
          <option value="">카테고리 선택</option>
          <option value="free">자유게시판</option>
          <option value="share">정보공유</option>
          <option value="activity">활동모집</option>
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
        previewStyle="vertical" // 미리보기 스타일 지정
        height="500px" // 에디터 창 높이
        initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
        toolbarItems={[
          // 툴바 옵션 설정
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          // ['code', 'codeblock'],
        ]}
        onChange={onChange}
        plugins={[colorSyntax]}
        language="ko-KR"
        hooks={{ addImageBlobHook: onUploadImage }}
        hideModeSwitch={true} // 하단의 타입 선택 탭 숨기기
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
