import React, { useContext, useEffect } from 'react';
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	Paper,
	Skeleton,
	Tab,
	Typography
} from '@mui/material';
import AceEditor from 'react-ace';
import { useMutation, useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../providers/auth';
import { StrapiBody } from '../models/stapi';
import { Solution } from '../models/solution';
import { Assignment } from '../models/assignment';
import { Lab } from '../models/lab';
import ReactMarkdown from 'react-markdown';
import { Topic } from '../models/topic';
import { Course } from '../models/course';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ResponsiveAppBar } from '../components/Menu';
import { TabContext, TabList, TabPanel } from '@mui/lab';

type SolutionWithPopulate = StrapiBody<
  Solution & {
    assignment: StrapiBody<
      Assignment & { lab: StrapiBody<Lab & { topic: StrapiBody<Topic & { course: StrapiBody<Course> }> }> }
    >;
  }
>;

export const Editor = () => {
	const { solutionId } = useParams();
	const auth = useContext(AuthContext);
	const [tab, setTab] = React.useState('1');
	const [code, setCode] = React.useState('');
	const solution = useQuery(
		['solution', solutionId],
		() =>
			auth.client.get<SolutionWithPopulate>(`/solutions/${solutionId}`, {
				params: { populate: ['assignment', 'assignment.lab', 'assignment.lab.topic', 'assignment.lab.topic.course'] }
			}),
		{
			enabled: !!solutionId
		}
	);
	const submit = useMutation(['solution', solutionId], () =>
		auth.client.put(`/solutions/${solutionId}`, JSON.stringify({ data: { code } }), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	);

	useEffect(() => {
		if (solution.data) {
			setCode(solution.data.data.data.attributes.code);
		}
	}, [solution.data]);

	return (
		<React.Fragment>
			<ResponsiveAppBar />
			<Container component="main" maxWidth="lg" sx={{ mb: 10 }}>
				<Paper style={{ padding: 20 }}>
					<Grid container direction="row" spacing={5} justifyContent='space-around'>
						<Grid item>
							<Card>
								{!solution.isSuccess ? (
									<Skeleton height={100} />
								) : (
									<Grid container direction="column" spacing={2}>
										<Grid item>
											<Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
												<Link
													to={`/courses/${solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes.topic.data.attributes.course.data.id}`}
												>
													{
														solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes.topic
															.data.attributes.course.data.attributes.name
													}
												</Link>
												<Link
													to={`/topics/${solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes.topic.data.id}`}
												>
													{
														solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes.topic
															.data.attributes.title
													}
												</Link>
												<Link
													to={`/labs/${solution.data?.data.data.attributes.assignment.data.attributes.lab.data.id}`}
												>
													{solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes.title}
												</Link>
											</Breadcrumbs>
										</Grid>
										<Grid item>
											<TabContext value={tab}>
												<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
													<TabList onChange={(_, v) => setTab(v)} aria-label="lab API tabs example">
														<Tab label="Instructions" value="1" />
														<Tab label="Sample" value="2" />
													</TabList>
												</Box>
												<TabPanel value="1" style={{ width: 400}}>
													<Typography>
														<ReactMarkdown>
															{
																solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes
																	.description
															}
														</ReactMarkdown>
													</Typography>
												</TabPanel>
												<TabPanel value="2">
													<Grid
														container
														direction="column"
														spacing={1}
														sx={{
															'--Grid-borderWidth': '1px',
															borderTop: 'var(--Grid-borderWidth) solid',
															borderLeft: 'var(--Grid-borderWidth) solid',
															borderColor: 'divider',
															'& > div': {
																borderRight: 'var(--Grid-borderWidth) solid',
																borderBottom: 'var(--Grid-borderWidth) solid',
																borderColor: 'divider'
															}
														}}
													>
														<Grid item>
															<Typography variant="body1">Input:</Typography>
														</Grid>
														<Grid item>
															<Typography variant="body2">
																{
																	solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes
																		.input
																}
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="body1">Output:</Typography>
														</Grid>
														<Grid item>
															<Typography variant="body2">
																{
																	solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes
																		.output
																}
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="body1">Explanation:</Typography>
														</Grid>
														<Grid item>
															<Typography variant="body2">
																{
																	solution.data?.data.data.attributes.assignment.data.attributes.lab.data.attributes
																		.explanation
																}
															</Typography>
														</Grid>
													</Grid>
												</TabPanel>
											</TabContext>
										</Grid>
									</Grid>
								)}
							</Card>
						</Grid>
						<Grid item>
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<AceEditor
										mode="python"
										theme="terminal"
										name="blah2"
										fontSize={14}
										showPrintMargin={true}
										showGutter={true}
										highlightActiveLine={true}
										width={'500px'}
										value={code}
										onChange={(value) => setCode(value)}
										setOptions={{
											enableBasicAutocompletion: true,
											enableLiveAutocompletion: true,
											enableSnippets: true,
											showLineNumbers: true,
											tabSize: 2
										}}
									/>
								</Grid>
								<Grid item>
									<Grid container spacing={5} justifyContent="space-around">
										<Grid item>
											<Grid container spacing={1}>
												<Grid item>
													<Typography variant="body1">Runtime:</Typography>
												</Grid>
												<Grid item>
													<Typography variant="body1">{solution.data?.data.data.attributes.runtime}</Typography>
												</Grid>
											</Grid>
										</Grid>
										<Grid item>
											<Grid container spacing={1}>
												<Grid item>
													<Typography variant="body1">Status:</Typography>
												</Grid>
												<Grid item>
													<Typography variant="body1">{solution.data?.data.data.attributes.status}</Typography>
												</Grid>
											</Grid>
										</Grid>
										<Grid item>
											<Grid container spacing={1}>
												<Grid item>
													<Typography variant="body1">Score:</Typography>
												</Grid>
												<Grid item>
													<Typography variant="body1">
														{solution.data?.data.data.attributes.passed}/{solution.data?.data.data.attributes.total}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Button variant="contained" color="primary" fullWidth onClick={() => submit.mutate()}>
										{submit.isLoading ? <CircularProgress /> : 'SUBMIT'}
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		</React.Fragment>
	);
};
