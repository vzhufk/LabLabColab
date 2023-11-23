import { Button, Container, Grid, Paper, Skeleton, Typography } from '@mui/material';
import React, { useContext } from 'react';
import ResponsiveAppBar from '../components/Menu';
import { AuthContext } from '../providers/auth';
import { useQuery } from 'react-query';
import { StrapiBody, StrapiList } from '../models/stapi';
import { Assignment } from '../models/assignment';
import { Lab } from '../models/lab';
import { Topic } from '../models/topic';
import { Course } from '../models/course';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

type AssignmentsWithPopulate = {
  data: StrapiList<
    Assignment & { lab: StrapiBody<Lab & { topic: StrapiBody<Topic & { course: StrapiBody<Course> }> }> }
  >;
};

const columns: GridColDef[] = [
	{ field: 'course', headerName: 'Course', width: 200 },
	{ field: 'topic', headerName: 'Topic', width: 150 },
	{ field: 'lab', headerName: 'Lab Name', width: 250 },
	{ field: 'assignedAt', headerName: 'Assigned At', width: 300 },
	{ field: 'mark', headerName: 'Mark', width: 50 },
	{ field: 'id', headerName: 'Solution', width: 150, renderCell: (params) => <Link to={`/labs/${params.value}/solution`}><Button>TO SOLUTION</Button></Link>}
];

const getRows = (data: AssignmentsWithPopulate) =>
	data.data.data.map((assignment) => ({
		id: assignment.id,
		course: assignment.attributes.lab.data.attributes.topic.data.attributes.course.data.attributes.name,
		topic: assignment.attributes.lab.data.attributes.topic.data.attributes.title,
		lab: assignment.attributes.lab.data.attributes.title,
		assignedAt: assignment.attributes.createdAt,
		mark: assignment.attributes.lab.data.attributes.topic.data.attributes.points
	}));

export const Labs = () => {
	const { client } = useContext(AuthContext);

	const assignments = useQuery<AssignmentsWithPopulate>(['assignments'], () =>
		client.get('/assignments', { params: { populate: ['lab', 'lab.topic', 'lab.topic.course'] } })
	);
	// filters: { student: { $eq: user.id }, },
	return (
		<React.Fragment>
			<ResponsiveAppBar />
			<Container component="main" maxWidth="lg" sx={{ mb: 10 }}>
				{!assignments.data ? (
					<Skeleton variant="rectangular" />
				) : (
					<Paper style={{ padding: 20 }}>
						<Grid container direction="column" spacing={2}>
							<Grid item>
								<Typography variant="h6">Your labs ({JSON.stringify(assignments.data.data.data.length)})</Typography>
							</Grid>
							{<DataGrid rows={getRows(assignments.data)} columns={columns} />}
						</Grid>
					</Paper>
				)}
			</Container>
		</React.Fragment>
	);
};
