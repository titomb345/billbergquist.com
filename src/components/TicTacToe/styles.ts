import styled from "@emotion/styled";
import { Column, Text } from "@varius.io/wombo";

export const StyledSizeColumn = styled(Column)`
	padding: ${(props: any) => props.theme.rhythm(2)};
	cursor: pointer;
	transition: all 0.15s ease-in-out;

	&:hover {
		background-color: rgba(0, 41, 83, 0.2);
	}
`;

export const StyledSpace = styled(Column)`
	display: flex;
	height: 100px;
	cursor: ${(props: any) => (props.hasOwner ? "not-allowed" : "pointer")};
	border: 1px solid black;
	align-items: center;
	justify-content: center;
	font-size: ${(props: any) => props.theme.ms(1)};
`;

export const StyledTitle = styled(Text)`
	margin-bottom: ${(props: any) => props.theme.rhythm(1)} !important;
`;
