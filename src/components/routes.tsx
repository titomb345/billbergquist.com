import * as React from "react";
import { RouteComponentProps } from "react-router";

// Route Components
import Homepage from "components/Homepage/Homepage";
import Dartmud from "components/Dartmud/Dartmud";
import TicTacToe from "components/TicTacToe/TicTacToe";

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
	{
		path: "/dartmud",
		component: Dartmud,
		exact: true,
	},
	{
		path: "/tic-tac-toe",
		component: TicTacToe,
		exact: true,
	},
];

export default routes;
