import { useCallback, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';

import SchemaCreateTeam from '../../../schema/schemaCreateTeamForm';
import {
	ButtonsContainer,
	Container,
	ContentContainer,
	InnerContent,
	PageHeader,
	StyledForm,
	SubContainer
} from '../../../styles/pages/boards/new.styles';
import Icon from '../../icons/Icon';
import Button from '../../Primitives/Button';
import Text from '../../Primitives/Text';
import TeamMembersList from './ListCardsMembers';
import TeamName from './TeamName';
import TipBar from './TipBar';

const CreateTeam = () => {
	const router = useRouter();

	const [isBackButtonDisable, setBackButtonState] = useState(false);

	const methods = useForm<{ text: string }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			text: ''
		},
		resolver: joiResolver(SchemaCreateTeam)
	});

	const teamName = useWatch({
		control: methods.control,
		name: 'text'
	});

	const handleBack = useCallback(() => {
		setBackButtonState(true);
		router.back();
	}, [router]);

	return (
		<Container>
			<PageHeader>
				<Text color="primary800" heading={3} weight="bold">
					Create New Team
				</Text>
				<Button isIcon disabled={isBackButtonDisable} onClick={handleBack}>
					<Icon name="close" />
				</Button>
			</PageHeader>
			<ContentContainer>
				<SubContainer>
					<StyledForm direction="column">
						<InnerContent direction="column">
							<FormProvider {...methods}>
								<TeamName teamName={teamName} />
								<TeamMembersList />
							</FormProvider>
						</InnerContent>
						<ButtonsContainer gap="24" justify="end">
							<Button
								disabled={isBackButtonDisable}
								type="button"
								variant="lightOutline"
								onClick={handleBack}
							>
								Cancel
							</Button>
							<Button type="submit">Create team</Button>
						</ButtonsContainer>
					</StyledForm>
				</SubContainer>
				<TipBar />
			</ContentContainer>
		</Container>
	);
};

export default CreateTeam;
