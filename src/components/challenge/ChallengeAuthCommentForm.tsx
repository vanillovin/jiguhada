import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import useInput from '../../hooks/useInput';
import { createChallengeAuthComment, uploadChallengeAuthImg } from '../../modules/challenge/api';
import { currentUserState } from '../../modules/user/atom';

function ChallengeAuthCommentForm({ id }: { id: string }) {
  const currentUser = useRecoilValue(currentUserState);
  const { value: content, onChangeValue, onClearValue } = useInput('');
  const {
    value: authImgUrl,
    setValue: setAuthImgUrl,
    onClearValue: onClearAuthImgUrl,
  } = useInput('');

  const handleUploadChallengeAuthImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('imgFile', file);
    uploadChallengeAuthImg(formData)
      .then((data) => {
        // console.log('uploadChallengeAuthImg data :', data);
        setAuthImgUrl(data.imgUrl);
      })
      .catch((err) => {
        // console.log('uploadChallengeAuthImg err :', err);
        toast.error(err.message.split('-')[1]);
      });
  };

  const onClearFormValue = () => {
    onClearValue();
    onClearAuthImgUrl();
  };

  const handleCreateChallengeAuthComment = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }
    createChallengeAuthComment(currentUser.accessToken, {
      challengeId: Number(id),
      content,
      authImgUrl,
    })
      .then((res) => {
        // console.log('createChallengeAuthComment res :', res);
        onClearFormValue();
      })
      .catch((err) => {
        // console.log('createChallengeAuthComment err :', err);
        const [code, msg] = err.message.split('-');
        toast.error(msg);
        onClearFormValue();
      });
  };

  return (
    <form className="flex items-start border-t" onSubmit={handleCreateChallengeAuthComment}>
      <div className="flex-1">
        <input
          id="comment"
          name="content"
          className="outline-none flex-1 py-2 px-2 w-full"
          value={content}
          onChange={onChangeValue}
        />
        {authImgUrl && (
          <div className="relative m-2">
            <button
              onClick={onClearAuthImgUrl}
              className="absolute top-2 left-2 bg-black bg-opacity-50 w-8 h-8 rounded-full text-white"
            >
              ✕
            </button>
            <img src={authImgUrl} className="w-full rounded-sm" />
          </div>
        )}
      </div>
      <label
        htmlFor="attach-file"
        className={`px-2 flex items-center cursor-pointer text-jghd-blue ${
          !authImgUrl ? 'h-full' : 'py-3'
        }`}
      >
        첨부
      </label>
      <input
        id="attach-file"
        name="imgFile"
        type="file"
        accept="image*"
        onChange={handleUploadChallengeAuthImg}
        className="hidden"
      />
      <button
        type="submit"
        disabled={authImgUrl && content.length > 2 ? false : true}
        onClick={handleCreateChallengeAuthComment}
        className={`px-2 ${!authImgUrl ? 'h-full' : 'py-3'} ${
          authImgUrl && content.length > 2 ? 'text-jghd-green' : 'text-gray-3'
        }`}
      >
        입력
      </button>
    </form>
  );
}

export default ChallengeAuthCommentForm;
