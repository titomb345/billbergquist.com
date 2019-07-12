import * as React from "react";

// Route Components
import Homepage from "components/Homepage/Homepage"
import { RouteComponentProps } from "react-router";

export interface Route {
	path: string;
	component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
	exact?: boolean;
}

// Unauthenticated Routes
const routes: Route[] = [
	{
		path: "/",
		component: Homepage,
		exact: true,
	},
];

export default routes;
