import * as React from "react";
import { Container, Column, Row, Text, ThemeResult, withTheme } from "@varius.io/wombo";
import DocumentTitle from "react-document-title";
import { Link } from "react-router-dom";

interface Props {
	theme: ThemeResult;
}

const Dartmud = ({ theme }: Props) => (
	<DocumentTitle title="DartMUD | BillBergquist.com">
		<Container>
			<Row>
				<Column>
					<Text renderAs="h1">Hello Dartmud!</Text>

					<Link to={"/"}>
						<Text
							style={{
								opacity: 0.8,
								marginTop: theme.rhythm(1),
							}}
							renderAs="h5"
						>
							return to hompage
						</Text>
					</Link>
				</Column>
			</Row>
		</Container>
	</DocumentTitle>
);

export default withTheme(Dartmud);
