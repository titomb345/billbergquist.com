import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "utils/store";
import history from "utils/history";
import { ConnectedRouter } from "connected-react-router";
import catchErrors from "utils/catchErrors";
import DocumentTitle from "react-document-title";

// Components
import Layout from "components/Layout/Layout";
import NotFound from "components/Layout/NotFound";

// array of routes
import routes from "./routes";

// having throttling issues
history.listen((location, action) => {
	if (action === "POP") {
		return;
	}
});

const App = () => {
	return (
		<DocumentTitle title="BillBergquist.com">
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<Layout>
						<Switch>
							{routes.map((props, key) => (
								<Route key={key} {...props} />
							))}

							<Route component={NotFound} />
						</Switch>
					</Layout>
				</ConnectedRouter>
			</Provider>
		</DocumentTitle>
	);
};

export default catchErrors(App);
