import { useCallback, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';

import Icon from '../../components/icons/Icon';
import Button from '../../components/Primitives/Button';
import Text from '../../components/Primitives/Text';
import TeamsMembersList from '../../components/Teams/CreateTeam/ListCardsMembers';
import { ListMembers } from '../../components/Teams/CreateTeam/ListMembers';
import TeamName from '../../components/Teams/CreateTeam/TeamName';
import TipBar from '../../components/Teams/CreateTeam/TipBar';
import SchemaCreateTeam from '../../schema/schemaCreateTeamForm';
import {
	ButtonsContainer,
	Container,
	ContentContainer,
	InnerContent,
	PageHeader,
	StyledForm,
	SubContainer
} from '../../styles/pages/boards/new.styles';

const NewTeam: NextPage = () => {
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
					Create New Tem
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
								<TeamsMembersList />
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

export default NewTeam;
