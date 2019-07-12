import * as React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Column, Text, withTheme, ThemeResult } from "@varius.io/wombo";
import DocumentTitle from "react-document-title";

export interface NotFoundProps {
	theme: ThemeResult;
}

const NotFound = ({ theme }: NotFoundProps) => (
	<DocumentTitle title="Page Not Found | Varius Studio">
		<Container narrow>
			<Row
				style={{
					margin: theme.rhythm(3),
					textAlign: "center",
				}}
			>
				<Column>
					<Text renderAs="h1">Look at you, you hacker you.</Text>

					<Text
						renderAs="h3"
						style={{
							marginTop: theme.rhythm(1),
						}}
					>
						Error Code: 404
					</Text>

					<div
						style={{
							marginTop: theme.rhythm(4),
						}}
					>
						<Link to="/">Return to Homepage</Link>
					</div>
				</Column>
			</Row>
		</Container>
	</DocumentTitle>
);

export default withTheme(NotFound);
