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
import { ListMembers } from './ListMembers';
import TeamName from './TeamName';
import TipBar from './TipBar';

const CreateTeam = () => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);

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
		router.back();
	}, [router]);

	return (
		<Container>
			<PageHeader>
				<Text color="primary800" heading={3} weight="bold">
					Create New Team
				</Text>

				<Button isIcon onClick={handleBack}>
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
								<ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
							</FormProvider>
						</InnerContent>
						<ButtonsContainer gap="24" justify="end">
							<Button type="button" variant="lightOutline" onClick={handleBack}>
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
