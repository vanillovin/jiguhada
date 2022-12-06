import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import useInput from '../../hooks/useInput';
import { uploadChallengeAuthImg } from '../../modules/challenge/api';
import { currentUserState } from '../../modules/user/atom';

function ChallengeAuthCommentForm({ id }: { id: string }) {
  const currentUser = useRecoilValue(currentUserState);
  const { value: content, onChangeValue } = useInput('');
  // 'https://s3.ap-northeast-2.amazonaws.com/jiguhada-u…image/imgFile8b328aaa-53e8-41c5-8e1e-ad12eb5c3208'
  const { value: fileDataUrl, setValue: setFileDataUrl } = useInput('');

  const handleUploadChallengeAuthImg = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('imgFile', file);
    uploadChallengeAuthImg(formData)
      .then((data) => {
        console.log('uploadChallengeAuthImg data :', data);
        setFileDataUrl(data.imgUrl);
      })
      .catch((err) => {
        console.log('uploadChallengeAuthImg err :', err);
        toast.error(err.message.split('-')[1]);
      });
  };

  return (
    <form className="flex items-start border-t" onSubmit={() => {}}>
      <div className="flex-1">
        <input
          id="comment"
          name="content"
          className="outline-none flex-1 py-2 px-2 w-full"
          value={content}
          onChange={onChangeValue}
        />
        {fileDataUrl && (
          <div className="relative m-2">
            <button
              onClick={() => setFileDataUrl('')}
              className="absolute top-2 left-2 bg-black bg-opacity-50 w-8 h-8 rounded-full text-white"
            >
              ✕
            </button>
            <img src={fileDataUrl} className="w-full rounded-sm" />
          </div>
        )}
      </div>
      <label
        htmlFor="attach-file"
        onClick={() => {}}
        className={`px-2 flex items-center cursor-pointer text-jghd-blue ${
          !fileDataUrl ? 'h-full' : 'py-3'
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
        disabled={fileDataUrl && content.length > 2 ? false : true}
        onClick={() => {}}
        className={`px-2 ${!fileDataUrl ? 'h-full' : 'py-3'} ${
          content.length > 2 ? 'text-jghd-green' : 'text-gray-3'
        }`}
      >
        입력
      </button>
    </form>
  );
}

export default ChallengeAuthCommentForm;
