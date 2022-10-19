import { useCallback } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi/dist/joi';

import Icon from '../../components/icons/Icon';
import Button from '../../components/Primitives/Button';
import Text from '../../components/Primitives/Text';
import TeamName from '../../components/Teams/CreateTeam/TeamName';
import TipBar from '../../components/Teams/CreateTeam/TipBar';
import SchemaCreateTeam from '../../schema/schemaCreateTeamForm';
import {
	Container,
	ContentContainer,
	InnerContent,
	PageHeader,
	StyledForm,
	SubContainer
} from '../../styles/pages/boards/new.styles';

const NewTeam: NextPage = () => {
	const router = useRouter();

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
					Add new SPLIT board
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
							</FormProvider>
						</InnerContent>
					</StyledForm>
				</SubContainer>
				<TipBar />
			</ContentContainer>
		</Container>
	);
};

export default NewTeam;
