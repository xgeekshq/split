import { useEffect } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';

export type RecoilOptions = {
  recoilHandler: (value: any) => void;
  recoilState: RecoilState<any>;
};

const RecoilObserver = ({ recoilState, recoilHandler }: RecoilOptions) => {
  const value = useRecoilValue(recoilState);
  useEffect(() => recoilHandler(value), [recoilHandler, value]);
  return null;
};

export default RecoilObserver;
