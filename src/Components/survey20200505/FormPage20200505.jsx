import React, {useState} from 'react';
import Form from "./Form20200505";

import axios from 'axios';
import MessageSnackbar from "../../Components/MessageSnackbar";
import queryString from 'query-string'

import {withRouter} from 'react-router-dom'
import {BACKEND_URL} from "../../constants";


function FormPage20200505(props) {

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

	function submit() {
		setSubmitting(true);
		closeMessage();
		console.log("Submit");

		axios.post(BACKEND_URL + "20200505/submit", {form_data: formValues})
			.then(() => {
				setTimeout(() => {
					props.history.push('/20200505/verify' + getPathParams());
					setSubmitting(false);
				}, 1500);
			})
			.catch((error) => {
				setTimeout(() => {
					setSubmitting(false);
					props.history.push('/20200505/form' + getPathParams());
					setSnackbar({
						open: true,
						text: JSON.parse(error.request.response).status
					});
				}, 800)
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
		<React.Fragment>
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
		</React.Fragment>
	);

}

export default withRouter(FormPage20200505);
