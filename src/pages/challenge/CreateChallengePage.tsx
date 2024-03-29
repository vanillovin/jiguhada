import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BiCalendar, BiCamera } from 'react-icons/bi';

import { createChallengeRequest, imageUploadRequest } from '../../modules/challenge/api';
import {
  getChallengeDefaultImgUrl,
  tagsData,
  authFrequencyData,
  challengePeroidData,
  categoryData,
} from '../../modules/challenge/data';
import { AuthFrequency, CahllengeCategory, ChallengePeroid } from '../../modules/challenge/type';
import { getChallengeEndDate, getChallengeStartDate } from '../../modules/challenge/utils';
import { currentUserState } from '../../modules/user/atom';
import { getDay, getToday } from '../../utils/dateUtils';

export default function CreateChallengePage() {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  const [inputs, setInputs] = useState({
    title: '',
    challengeCategory: '',
    challengeDetails: '',
    authFrequency: '',
    challengePeroid: '',
    startDate: '',
    participantsCount: 2,
    authMethodContent: '',
    challengeAddDetails: '',
  });
  const {
    title,
    challengeCategory,
    challengeDetails,
    authFrequency,
    challengePeroid,
    startDate,
    participantsCount,
    authMethodContent,
    challengeAddDetails,
  } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangePCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!isNaN(+value) && +value <= 20) {
      setInputs((prev) => ({
        ...prev,
        participantsCount: +value,
      }));
    }
  };

  const [tags, setTags] = useState(tagsData);

  const handleChageTags = (value: string) => {
    setTags((prev) => {
      const checkable =
        prev[challengeCategory as CahllengeCategory].filter((p) => p.checked).length <= 2;
      return {
        ...prev,
        [challengeCategory]: prev[challengeCategory as CahllengeCategory].map((p) => {
          if (!p.checked && !checkable) return p;
          return p.value === value ? { ...p, checked: !p.checked } : p;
        }),
      };
    });
  };

  const handleChangeStartDate = (d: string) => {
    setInputs((prev) => ({
      ...prev,
      startDate: d,
    }));
  };

  const [sYear, sMonth, sDate, sDay] = startDate.split('.');
  const {
    year: eYear,
    month: eMonth,
    date: eDate,
    day: eDay,
  } = getChallengeEndDate(
    authFrequency as AuthFrequency,
    challengePeroid as ChallengePeroid,
    startDate
  );
  const eToday = getToday(getDay(+eYear, +eMonth, +eDate));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }
    if (!startDate) {
      alert('시작일을 선택해 주세요.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const [sHour, sMin] = formData.get('appt1')?.split(':');
    const [eHour, eMin] = formData.get('appt2')?.split(':');
    const data = {
      challengeTag: tags[challengeCategory as CahllengeCategory]
        .filter((_) => _.checked)
        .map((_) => _.value),
      title,
      challengeDetails,
      challengeCategory,
      challengeImg: challengeImg || getChallengeDefaultImgUrl(challengeCategory),
      challengeAddDetails,
      challengeAddImg,
      participantsCount: +participantsCount,
      authMethodContent,
      authMethodImg,
      authMethodFailImg,
      challengeStartDate: `${2022}-${12}-${6}`,
      challengePeroid,
      challengeEndDate: `${2023}-${1}-${8}`,
      authFrequency,
      authCountPerDay: 1,
      authAvailableTimeType: 'ALLDAY',
      authAvailableStartTime: `${sHour}:${sMin}:00`,
      authAvailableEndTime: `${eHour}:${eMin}:00`,
    };
    // console.log('onSubmit data:', data);
    createChallengeRequest(currentUser?.accessToken as string, data).then((res) => {
      console.log('createChallengeRequest res', res);
      navigate(`challenge/${res.challengeId}`);
    });
  };

  const [imgs, setImgs] = useState({
    challengeImg: '',
    challengeAddImg: '',
    authMethodImg: '',
    authMethodFailImg: '',
  });
  const { challengeImg, challengeAddImg, authMethodImg, authMethodFailImg } = imgs;

  const removeChallengeImg = () => {
    setImgs((prev) => ({
      ...prev,
      challengeImg: '',
    }));
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name;
    const file = event.target.files?.[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('imgFile', file);

    imageUploadRequest(formData)
      .then((data) => {
        console.log('challengeImageUpload data', data);
        setImgs((prev) => ({
          ...prev,
          [inputName]: data.imgUrl,
        }));
      })
      .catch((e) => {
        console.log('challengeImageUpload error', e);
      });

    // const fileReader = new FileReader();
    // fileReader.onload = (e: any) => {
    //   setFileDataUrl(e.target?.result);
    // };
    // fileReader.readAsDataURL(file);
  };

  const handleClearInput = (name: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  useEffect(() => {
    if (!currentUser) {
      alert('회원만 접근이 가능합니다. 로그인 후 이용해 주세요');
      navigate(-1);
    }
  }, [currentUser]);

  return (
    <section className="w-full max-w-md px-5">
      {/* <div className="w-full flex items-center justify-between">
        <button>x</button>
        <button>임시저장</button>
      </div> */}
      <h1 className="font-bold text-lg">챌린지를 만들어 주세요!</h1>
      <form onSubmit={onSubmit}>
        <div className="w-full mt-6 relative">
          <label htmlFor="title">
            <h2 className="font-bold">
              챌린지 제목<span className="text-red-400">*</span>
            </h2>
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            minLength={3}
            maxLength={30}
            onChange={onChange}
            className={`w-full border-b border-gray-4 outline-none p-2 mt-2 placeholder:text-sm
              ${title && title.length < 3 ? 'border-red-600' : ''}
            `}
            placeholder="예) 1만보 걷기"
          />
          {title.length > 0 && (
            <button
              type="button"
              onClick={() => handleClearInput('title')}
              className="absolute bottom-8 right-0 px-2"
            >
              x
            </button>
          )}
          <div className="mt-1 flex items-center justify-between">
            {title && title.length < 3 && (
              <p className="text-xs md:text-sm text-red-600 ml-1">최소 3글자 이상 입력해주세요.</p>
            )}
            <p className="text-xs md:text-sm text-gray-4 grow-1 text-end flex-1 justify-self-end">
              {title.length}/30
            </p>
          </div>
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              인증 빈도<span className="text-red-400">*</span>
            </h2>
          </label>
          {authFrequencyData.map((af) => (
            <div key={af.name}>
              <label className="cursor-pointer flex items-center mt-2">
                <input
                  type="radio"
                  name="authFrequency"
                  value={af.value}
                  onChange={onChange}
                  className="radio checked:bg-black"
                />
                <span className="label-text ml-2">{af.name}</span>
              </label>
              <p className="text-xs m-1 text-gray-4">
                {authFrequency === af.value && af.desc}
                {/* {document.querySelector(
                  'input[type=radio][name=authFrequency]:checked'
                )?.value === af.value && af.desc} */}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              챌린지 기간<span className="text-red-400">*</span>
            </h2>
          </label>
          {challengePeroidData.map((p) => (
            <label key={p.name} className="cursor-pointer flex items-center mt-2">
              <input
                type="radio"
                name="challengePeroid"
                onChange={onChange}
                value={p.value}
                className="radio checked:bg-black"
              />
              <span className="label-text ml-2">{p.name}</span>
            </label>
          ))}
        </div>

        {authFrequency && (
          <div className="w-full mt-6">
            <label>
              <h2 className="font-bold">
                시작일<span className="text-red-400">*</span>
              </h2>
            </label>
            <div className="flex flex-wrap">
              {/* {JSON.stringify(getChallengeStartDate(authFrequency))} */}
              {getChallengeStartDate(authFrequency as AuthFrequency).map(
                ({ year, month, date, day }, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleChangeStartDate(`${year}.${month}.${date}.${day}`)}
                    className={`border border-gray-4 rounded-full px-2 py-1 mt-2 mr-1 text-sm
                    ${
                      `${year}.${month}.${date}.${day}` === startDate ? 'bg-black text-white' : ''
                    }`}
                  >
                    {`${month + 1}. ${date} (${getToday(day)})`}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {authFrequency && challengePeroid && startDate && (
          <div className="flex items-center bg-gray-2 rounded-md py-3 px-4 font-semibold mt-6">
            <BiCalendar className="mr-2" size={22} />
            {`${+sYear || +eYear > 2022 ? `${sYear}. ` : ''} ${+sMonth + 1}. ${sDate} (${getToday(
              +sDay
            )}) ~ ${+eYear > 2022 ? `${eYear}. ` : ''}${+eMonth + 1}. ${+eDate} (${eToday})`}
          </div>
        )}

        <div className="w-full mt-6">
          <label htmlFor="auth-method-content">
            <h2 className="font-bold">
              인증 방법<span className="text-red-400">*</span>
            </h2>
          </label>
          <textarea
            id="auth-method-content"
            name="authMethodContent"
            onChange={onChange}
            value={authMethodContent}
            className={`w-full p-2 h-20 border border-gray-4 outline-none resize-none mt-2 placeholder:text-sm
             ${authMethodContent && authMethodContent.length < 14 ? 'border-red-600' : ''}
            `}
            placeholder="예) 오늘 날짜와 걸음 수가 적힌 만보기 캡쳐 화면 업로드"
            minLength={14}
            maxLength={400}
            required
          />
          <div className="flex items-center justify-between">
            {authMethodContent && authMethodContent.length < 14 && (
              <p className="text-xs md:text-sm text-red-600 ml-1">최소 14글자 이상 입력해주세요.</p>
            )}
            <p className="text-xs md:text-sm text-gray-4 grow-1 text-end flex-1 justify-self-end">
              {authMethodContent.length}/400
            </p>
          </div>
          <ul className="text-sm text-gray-4 mt-2">
            <li className="ml-5 list-disc">
              챌린지가 시작되면 인증 방법을 수정할 수 없습니다. 신중히 작성해주세요.
            </li>
            <li className="ml-5 list-disc">
              참가자들이 혼란을 겪지 않도록 정확한 기준과 구체적인 인증방법을 적어주세요.
            </li>
          </ul>
        </div>

        <div className="w-full mt-6">
          <label htmlFor="t">
            <h2 className="font-bold">인증샷 예시</h2>
          </label>
          <div className="flex mt-2">
            <div className="flex flex-col items-center justify-center border border-gray-4 w-48 h-56 mr-2">
              <label
                htmlFor="success-example-file"
                className="flex flex-col items-center justify-center cursor-pointer flex-1"
              >
                {authMethodImg ? (
                  <img src={authMethodImg} className="w-full h-full" />
                ) : (
                  <>
                    <BiCamera size={24} className="text-gray-5" />
                    <div className="w-full text-sm mt-2 text-gray-5 text-center">
                      인증 성공 예시를 추가해주세요.
                    </div>
                  </>
                )}
              </label>
              <input
                name="authMethodImg"
                id="success-example-file"
                type="file"
                accept="image*"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="w-full text-center bg-gray-2">O</div>
            </div>
            <div className="flex flex-col items-center justify-center border border-gray-4 w-48 h-56">
              <label
                htmlFor="failure-example-file"
                className="flex flex-col items-center justify-center cursor-pointer flex-1"
              >
                {authMethodFailImg ? (
                  <img src={authMethodFailImg} className="w-full h-full" />
                ) : (
                  <>
                    <BiCamera size={24} className="text-gray-5" />
                    <div className="w-full text-sm mt-2 text-gray-5 text-center">
                      인증 실패 예시를 추가해주세요.
                    </div>
                  </>
                )}
              </label>
              <input
                name="authMethodFailImg"
                id="failure-example-file"
                type="file"
                accept="image*"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="w-full text-center bg-gray-2">X</div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <label htmlFor="t">
            <h2 className="font-bold">
              인증 가능 시간<span className="text-red-400">*</span>
            </h2>
          </label>
          <div className="flex border border-gray-4 mt-2">
            <div className="w-1/2 flex flex-col justify-center border-r border-gray-4 p-3">
              <label htmlFor="appt1">
                <h3 className="text-sm font-medium text-gray-4">시작 시간</h3>
              </label>
              <input
                type="time"
                id="appt1"
                name="appt1"
                defaultValue="00:00"
                min="00:00"
                max="18:00"
                className="font-medium outline-none"
                required
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center p-3">
              <label htmlFor="appt2">
                <h3 className="text-sm font-medium text-gray-4">종료 시간</h3>
              </label>
              <input
                type="time"
                id="appt2"
                name="appt2"
                defaultValue="23:59"
                min="00:00"
                max="24:00"
                className="font-medium outline-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <label htmlFor="add-detail">
            <h2 className="font-bold">챌린지 소개</h2>
            <h3 className="text-sm">사진과 글을 추가해 챌린지를 소개해보세요.</h3>
          </label>
          <textarea
            id="add-detail"
            name="challengeAddDetails"
            onChange={onChange}
            value={challengeAddDetails}
            className="w-full p-2 h-20 border border-gray-4 outline-none resize-none mt-2 placeholder:text-sm"
            placeholder="예) 매일 1만보 걷고 건강해지기! 오늘부터 같이 해봐요 :)"
            maxLength={400}
          />
          <p className="text-xs md:text-sm text-gray-4 grow-1 text-end">
            {challengeAddDetails.length}/400
          </p>
          <div className="border border-gray-3 flex items-center justify-center w-14 h-14 -mt-4">
            <label htmlFor="add-img">
              {challengeAddImg ? (
                <img src={challengeAddImg} />
              ) : (
                <BiCamera size={20} className="" />
              )}
            </label>
            <input
              name="challengeAddImg"
              id="add-img"
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              최대 모집 인원
              <span className="font-normal text-sm"> (최소 2명 ~ 최대 20명)</span>
            </h2>
          </label>
          <div className="flex items-center justify-center border-b border-gray-4 text-lg mt-2 placeholder:font-semibold">
            <input
              className="w-10 text-center p-2 outline-none font-semibold"
              min={2}
              max={20}
              value={participantsCount}
              onChange={onChangePCount}
              // pattern="/^[0-9]+$/"
              placeholder="2"
              required
            />
            <span className="font-semibold">명</span>
          </div>
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              카테고리<span className="text-red-400">*</span>
            </h2>
          </label>
          {categoryData.map((cat) => (
            <label key={cat.value} className="cursor-pointer flex items-center mt-2">
              <input
                type="radio"
                name="challengeCategory"
                value={cat.value}
                onChange={onChange}
                className="radio checked:bg-black"
                required
              />
              <span className="label-text ml-2">{cat.name}</span>
            </label>
          ))}
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              대표사진<span className="text-red-400">*</span>
            </h2>
          </label>
          <div className="relative border mt-2">
            <img
              className="w-full"
              src={challengeImg || getChallengeDefaultImgUrl(challengeCategory)}
            />
            <input
              name="challengeImg"
              id="challenge-img"
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
            <label
              htmlFor="challenge-img"
              className="cursor-pointer absolute w-full left-0 bottom-0 py-1 flex items-center justify-center text-white bg-black bg-opacity-10"
            >
              <BiCamera />
              <span className="ml-1 text-sm">사진 선택</span>
              {challengeImg && (
                <button
                  type="button"
                  onClick={removeChallengeImg}
                  className="text-sm text-black ml-2"
                >
                  사진 제거
                </button>
              )}
            </label>
          </div>
        </div>

        <div className="w-full mt-6">
          <label>
            <h2 className="font-bold">
              태그를 선택해주세요
              <span className="font-normal text-sm"> (최대 3개)</span>
            </h2>
          </label>
          {challengeCategory ? (
            tags[challengeCategory as CahllengeCategory].map((tag, i) => (
              <button
                key={i}
                type="button"
                name="tags"
                onClick={() => handleChageTags(tag.value)}
                value={tag.value}
                className={`border border-gray-4 rounded-full py-1 px-2 mr-1 mt-2 text-sm ${
                  tag.checked ? 'bg-black text-white' : ''
                }`}
              >
                {tag.name}
              </button>
            ))
          ) : (
            <ul></ul>
          )}
        </div>

        <div className="w-full text-end mt-6">
          <button type="submit" className="bg-black text-white px-3 py-2 rounded-md">
            챌린지 개설하기
          </button>
        </div>
      </form>
    </section>
  );
}
