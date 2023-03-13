import { useRecoilCallback } from 'recoil';
import Icon from '../Primitives/Icons/Icon/Icon';
import Button from '../Primitives/Inputs/Button/Button';

const RecoilDevTools = () => {
  const getAtomValues = async (snapshot: any) => {
    // eslint-disable-next-line no-console
    console.log('Atom Values:');
    const state: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const node of snapshot.getNodes_UNSTABLE()) {
      // eslint-disable-next-line no-await-in-loop
      const value = await snapshot.getPromise(node);
      state[node.key] = value;
    }
    // eslint-disable-next-line no-console
    console.log(state);
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
      size="lg"
      onClick={dumpRecoilState}
    >
      <Icon name="settings" css={{ color: '$secondaryDark' }} />
    </Button>
  );
};

export default RecoilDevTools;
