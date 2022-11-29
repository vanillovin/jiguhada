import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { currentUserState } from '../modules/user/atom';
import { createPostRequest, uploadImgRequest } from '../modules/board/api';
import { toast } from 'react-toastify';

interface LocationState {
  data: {
    category: string;
    title: string;
    content: string;
    contentImgList: string[];
    tempImgList: string[];
  };
}

export default function WritePost() {
  const editorRef = useRef<ToastEditor>(null);
  const currentUser = useRecoilValue(currentUserState);
  const resetUser = useResetRecoilState(currentUserState);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  let contentImgList: string[] = locationState?.data.contentImgList || []; // 에디터
  let tempImgList: string[] = locationState?.data.tempImgList || []; // 전부

  useEffect(() => {
    if (!currentUser?.accessToken) {
      alert('쓰기 권한이 없습니다');
      navigate(-1);
    }
  }, [currentUser]);

  const onChange = () => {
    const data = editorRef.current?.getInstance().getHTML();
    contentImgList = tempImgList.filter((img) => data?.includes(img));
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
        console.log('onUploadImage data', data);
        contentImgList.push(data.imgUrl);
        tempImgList.push(data.imgUrl);
        callback(data.imgUrl);
      })
      .catch((err) => {
        console.log('uploadImgRequest err', err);
      });
  };

  const handleCreateBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const instance = editorRef.current?.getInstance();
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const content = instance?.getHTML() as string;
    if (!category) {
      alert('카테고리를 선택해 주세요');
      return;
    }
    if (!title) {
      alert('제목을 입력해 주세요');
      return;
    }
    if (content === '<p><br></p>' || content.split('<p>')[1].trim().length < 8) {
      alert('내용은 4자 이상 입력해 주세요');
      return;
    }
    const imgList = tempImgList.filter((img) => content?.includes(img));
    const deletedImgList = tempImgList.filter((img) => !imgList.includes(img));
    const data = {
      category,
      title,
      imgList,
      content,
      deletedImgList,
    };
    createPostRequest(currentUser.accessToken, data)
      .then((res) => {
        toast.success('게시글 작성 완료 👌');
        navigate(`/board/${res.boardId}`);
      })
      .catch((err) => {
        const [code, message] = err.message.split('-'); // EXPIRE_ACCESS_TOKEN-만료된 토큰입니다. 다시 로그인해주세
        if (code === 'EXPIRE_ACCESS_TOKEN') {
          toast(message, {
            // closeButton: false,
            onClose: () => {
              if (window.confirm('로그인하시겠습니까?')) {
                resetUser(); // 로그아웃
                // 작성중인게시글데이터보관
                navigate('/register', {
                  state: { path: '/board/new', data },
                });
              } else {
                navigate(-1);
              }
            },
          });
        } else {
          toast.error(message);
        }
      });
  };

  return (
    <form onSubmit={handleCreateBoard} className="w-screen max-w-4xl p-4">
      <div className="flex w-full text-start border-b border-gray-300 mb-4">
        <select
          name="category"
          defaultValue={locationState?.data.category || ''}
          className="outline-none p-2"
        >
          <option value="">카테고리 선택</option>
          <option value="VEGAN">비건</option>
          <option value="ENVIRONMENT">환경</option>
          <option value="QUESTION">Q&A</option>
          <option value="FREE">자유게시판</option>
        </select>
        <input
          defaultValue={locationState?.data.title || ''}
          name="title"
          className="outline-none p-2 flex-grow"
          placeholder="글 제목을 입력해 주세요"
        />
      </div>
      <ToastEditor
        initialValue={locationState?.data.content || ''}
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
