import React, { useState, FC, useEffect } from "react";
import Head from "next/head";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { createClient } from "@supabase/supabase-js";
import Typography from "@material-ui/core/Typography";
import { Client, register } from "discord-rpc";
import { Formik, Form, Field } from "formik";
import { Button, Checkbox, LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { TextField } from "formik-material-ui";
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";

require("dotenv").config();

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			textAlign: "center",
			paddingTop: theme.spacing(4),
		},
	})
);

interface Values {
	title: string;
	subtitle: string;
	current: number;
	max: number;
}

const Home: FC = () => {
	const { storage } = createClient(process.env.URL!, process.env.KEY!);

	const handleClose = () => setOpen(false);
	const handleClick = () => setOpen(true);
	const classes = useStyles({});
	const clientId = "784429545293479978";

	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	const [showError, setShowError] = useState<boolean>(false);
	const [alertText, setAlertText] = useState<string>(
		"This is a success alert — check it out!"
	);

	const [open, setOpen] = React.useState(false);
	const client = new Client({
		transport: "ipc",
	});
	const [files, setFile] = useState<File[]>();
	const [isParty, setIsParty] = useState<boolean>();
	const [imgUrl, setImgUrl] = useState<string>();

	const dropzoneSave = (_files: File[]) => setFile(_files);
	const dropzoneClose = () => setOpen(false);

	const destroy = async () => {
		await client.connect(clientId);

		client.clearActivity();
	};

	const update = async (
		values: Values,
		setSubmitting: (isSubmitting: boolean) => void
	) => {
		const startTimestamp = new Date();
		await client.connect(clientId);

		const party = {
			partyMax: values.max || 1,
			partySize: values.current || 1,
		};

		if (isParty) {
			return client.setActivity({
				details: values.title,
				state: values.subtitle || "  ",
				startTimestamp,
				partyId: "2333",
				largeImageKey: "637405957010986350",
				smallImageKey: "sfdasdfasdf",
				instance: true,
				...party,
			});
		}

		client.setActivity({
			details: values.title,
			state: values.subtitle || "  ",
			startTimestamp,
			partyId: "2333",
			largeImageKey: "sfdasdfasdf",
			smallImageKey: "sfdasdfasdf",
			instance: true,
		});
	};

	useEffect(() => console.log(files != null && files[0].name), [files]);
	useEffect(() => {
		const res = register(clientId);
		console.log(res);
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>Home - Discord-RPC</title>
			</Head>
			<div className={classes.root}>
				<Typography variant="h4" gutterBottom>
					Discord-RPC
				</Typography>
				<div style={{ flexDirection: "row", maxHeight: 60 }}>
					<img
						src={
							// (files != null && files[0].) ||
							"/images/logo.png"
						}
						height={68}
					/>
					<Button
						variant="outlined"
						color="primary"
						style={{ marginBottom: 55, marginLeft: 5 }}
						onClick={() => setOpen(true)}
					>
						Change Icon
					</Button>
				</div>
				<Formik
					initialValues={{
						title: "",
						subtitle: "",
						current: 1,
						max: 10,
					}}
					onSubmit={(values, { setSubmitting }) =>
						update(values, setSubmitting)
					}
				>
					{({ submitForm, isSubmitting }) => (
						<Form>
							<Field
								component={TextField}
								name="title"
								type="text"
								label="Title"
							/>
							<br />
							<Field
								style={{ marginTop: 10 }}
								component={TextField}
								type="text"
								name="subtitle"
								label="Subtitle"
							/>
							{isParty && (
								<>
									<br />
									<Field
										style={{ marginTop: 10 }}
										component={TextField}
										type="number"
										name="current"
										label="Current"
									/>
									<br />
									<Field
										style={{ marginTop: 10 }}
										component={TextField}
										type="number"
										name="max"
										label="Max"
									/>
								</>
							)}
							{isSubmitting && <LinearProgress />}
							<br />
							<Button
								style={{ marginTop: 15 }}
								variant="contained"
								color="primary"
								disabled={isSubmitting}
								onClick={submitForm}
							>
								Update
							</Button>
							<br />
							<Button
								style={{ marginTop: 15 }}
								variant="contained"
								color="secondary"
								disabled={isSubmitting}
								onClick={destroy}
							>
								Clear
							</Button>
						</Form>
					)}
				</Formik>
				<Checkbox
					title="Show Party"
					color="primary"
					onChange={(_, checked) => setIsParty(checked)}
				/>
				{showSuccess && (
					<Alert
						variant="filled"
						severity="success"
						style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}
					>
						{alertText}
					</Alert>
				)}
				<DropzoneDialog
					open={open}
					onSave={dropzoneSave}
					acceptedFiles={["image/jpeg", "image/png"]}
					showPreviews={true}
					filesLimit={1}
					maxFileSize={5000000}
					onClose={dropzoneClose}
				/>
			</div>
		</React.Fragment>
	);
};

export default Home;
