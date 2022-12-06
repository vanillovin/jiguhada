import { useRecoilValue } from 'recoil';
import useInput from '../../hooks/useInput';
import { currentUserState } from '../../modules/user/atom';

function ChallengeAuthCommentForm({ id }: { id: string }) {
  const currentUser = useRecoilValue(currentUserState);
  const { value: content, onChangeValue } = useInput('');

  return (
    <form className="flex items-center border-t" onSubmit={() => {}}>
      <button
        type="button"
        onClick={() => {}}
        className={`px-3 h-full ${true ? 'bg-jghd-blue text-white' : ''}`}
      >
        첨부
      </button>
      <input
        id="comment"
        name="content"
        className="outline-none flex-1 py-2 px-2"
        value={content}
        onChange={onChangeValue}
      />
      <button
        type="submit"
        disabled={content.length > 2 ? false : true}
        onClick={() => {}}
        className={`px-3 h-full ${
          content.length > 2 ? 'text-jghd-green' : 'text-gray-3'
        }`}
      >
        입력
      </button>
    </form>
  );
}

export default ChallengeAuthCommentForm;
