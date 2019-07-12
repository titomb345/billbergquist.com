import * as React from "react";
import { Container, Column, Row, Text } from "@varius.io/wombo";
import DocumentTitle from "react-document-title";

const Homepage = () => (
	<DocumentTitle title="BillBergquist.com | Homepage">
		<Container>
			<Row>
				<Column>
					<Text renderAs="h1">Hello World!</Text>
				</Column>
			</Row>
		</Container>
	</DocumentTitle>
)

export default Homepage;
