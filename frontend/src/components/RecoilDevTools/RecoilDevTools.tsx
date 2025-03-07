import { useRecoilCallback } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';

const RecoilDevTools = () => {
  const getAtomValues = async (snapshot: any) => {
    const state: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const node of snapshot.getNodes_UNSTABLE()) {
      // eslint-disable-next-line no-await-in-loop
      const value = await snapshot.getPromise(node);
      state[node.key] = value;
    }
  };

  const dumpRecoilState = useRecoilCallback(
    ({ snapshot }) =>
      async () =>
        getAtomValues(snapshot),
    [],
  );

  return (
    <Button
      isIcon
      css={{ position: 'fixed', bottom: '$58', left: '$12' }}
      onClick={dumpRecoilState}
      size="lg"
    >
      <Icon css={{ color: '$secondaryDark' }} name="settings" />
    </Button>
  );
};

export default RecoilDevTools;
