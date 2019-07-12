import * as React from "react";
import Error from "components/Layout/Error";

interface ErrorState {
	error: any;
	errorInfo: any;
}

const errorCatcher = WrappedComponent => {
	return class extends React.Component<any, ErrorState> {
		constructor(props) {
			super(props);

			this.state = {
				error: null,
				errorInfo: null,
			};
		}

		componentDidCatch(error, errorInfo) {
			this.setState({ error, errorInfo });
		}

		render() {
			if (this.state.error) {
				return <Error {...this.state} />;
			}

			return <WrappedComponent {...this.props} />;
		}
	};
};

export default errorCatcher;
