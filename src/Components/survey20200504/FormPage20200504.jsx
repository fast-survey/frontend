import React, {useState} from 'react';
import Form from "./Form20200504";

import axios from 'axios';
import MessageSnackbar from "../../Components/MessageSnackbar";
import queryString from 'query-string'

import {withRouter} from 'react-router-dom'
import {BACKEND_URL} from "../../constants";
import Container from "@material-ui/core/Container";


function FormPage20200504(props) {

	const pathParams = queryString.parse(window.location.search);
	let initialState = {
		email: "",
		election: {
		}
	};

	if ("email" in pathParams) {
		initialState.email = pathParams["email"].replace("+", " ");
	}

	const names = ["albers", "ballweg", "deniers", "schmidt"];
	for (let i=0; i<4; i++) {
		if (names[i] in pathParams) {
			initialState.election[names[i]] = (pathParams[names[i]] === "true");
		} else {
			initialState.election[names[i]] = false;
		}
	}


	const [formValues, setFormValuesRaw] = useState(initialState);

	function setFormValues(newValues) {
		closeMessage();
		setFormValuesRaw(newValues);
	}

	function getPathParams() {
		let pathParams = "?email=" + formValues["email"];

		names.forEach((name) => {
			pathParams += "&" + name + "=" + formValues.election[name];
		})

		return pathParams;
	}

	const [snackbar, setSnackbar] = useState({open: false, text: ""})
	const [submitting, setSubmitting] = useState(false);

	function closeMessage(){
		setSnackbar({open: false, text: snackbar.text});
	}

	function openMessage(text){
		setSnackbar({open: true, text: text});
	}

	function submit() {
		setSubmitting(true);
		closeMessage();
		console.log("Submit");

		let backend = axios.create({
			baseURL: BACKEND_URL,
			responseType: "json"
		});

		backend.post("20200504/submit", {form_data: formValues})
			.then(() => {
				// Timeout needed so that the user does not get on
				// mail.tum.de too fast (when outlook has not received
				// the mail yet)
				setTimeout(() => {
					setSubmitting(false);
					props.history.push('/20200504/verify' + getPathParams());
				}, 1500);
			})
			.catch(error => {
				// Timeout for a better visual experience
				setTimeout(() => {
					setSubmitting(false);
					props.history.push('/20200504/form' + getPathParams());
					console.log(error.response.data.status);
					openMessage(error.response.data.status);
				}, 800);
			})
	}

	function reset() {
		console.log("Reset");

		props.history.push('/form');

		setFormValues({
			email: "",
			election: {
				albers: false,
				ballweg: false,
				deniers: false,
				schmidt: false,
			}
		})
	}

	return (
		<Container maxWidth="sm">
			<Form
				formValues={formValues}
				setFormValues={setFormValues}
				handleSubmit={submit}
				handleReset={reset}
				submitting={submitting}
			/>
			<MessageSnackbar
				open={snackbar.open}
				text={snackbar.text}
				closeMessage={closeMessage}
			/>
		</Container>
	);

}

export default withRouter(FormPage20200504);