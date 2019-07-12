import * as React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Column, Text, withTheme, ThemeResult } from "@varius.io/wombo";
import styled from "@emotion/styled";

const StyledDetails = styled("details")`
	text-align: left;
	margin: 0 auto;
	max-width: 650px;
	width: 100%;
	white-space: pre-wrap;
`;

export interface ErrorProps {
	theme: ThemeResult;
	error: any;
	errorInfo: any;
}

const Error = ({ theme, error, errorInfo }: ErrorProps) => (
	<Container narrow>
		<Row
			style={{
				margin: theme.rhythm(3),
				textAlign: "center",
			}}
		>
			<Column>
				<Text renderAs="h1">We're sorry, but something went wrong.</Text>
				<Text
					renderAs="h3"
					style={{
						margin: `${theme.rhythm(1)} 0 ${theme.rhythm(1)}`,
					}}
				>
					We apologize for any inconvenience. Our team has been notified.
				</Text>

				{process.env.NODE_ENV !== "production" && (
					<StyledDetails>
						<Text
							style={{
								margin: `${theme.rhythm(1)} 0 0`,
							}}
						>
							<strong>{error && error.toString()}</strong>
						</Text>

						<Text>{errorInfo.componentStack}</Text>
					</StyledDetails>
				)}

				<div
					style={{
						marginTop: theme.rhythm(4),
					}}
				>
					<Link to="/">Return to Studio</Link>
				</div>
			</Column>
		</Row>
	</Container>
);

export default withTheme(Error);
