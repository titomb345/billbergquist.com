import * as React from "react";
import { Container, Column, Row, Text, ThemeResult, Button, withTheme } from "@varius.io/wombo";
import DocumentTitle from "react-document-title";
import { StyledSizeColumn, StyledSpace, StyledTitle } from "./styles";

interface Options {
	availableSizes: Size[];
}

const gameOptions: Options = {
	availableSizes: [3, 4, 5],
};

enum Players {
	X = "x",
	O = "o",
}

type Size = 3 | 4 | 5;

interface Space {
	owner?: Players;
	isBackDiagonal: boolean;
	isForwardDiagonal: boolean;
	isWinner?: boolean;
	row: number;
	col: number;
}

interface Board {
	spaces: Space[][];
	forwardDiagonals: Space[];
	backwardDiagonals: Space[];
	moves: number;
	size: Size;
}

interface Props {
	theme: ThemeResult;
}

interface State {
	board?: Board;
	size?: Size;
	currentPlayer: Players;
	winningPlayer?: Players;
}

class TicTacToe extends React.Component<Props, State> {
	initialState = {
		board: undefined,
		size: undefined,
		currentPlayer: Players.X,
		winningPlayer: undefined,
	};

	state = this.initialState;

	resetBoard = () => {
		this.setState(this.initialState);
	};

	buildBoard = (size: Size) => {
		const board: Board = {
			moves: 0,
			spaces: [],
			forwardDiagonals: [],
			backwardDiagonals: [],
			size,
		};

		for (let row = 0; row < size; row++) {
			const columns: Space[] = [];

			for (let col = 0; col < size; col++) {
				const space: Space = {
					row,
					col,
					isBackDiagonal: row === col,
					isForwardDiagonal: row === size - col - 1,
				};

				columns.push(space);

				if (space.isForwardDiagonal) {
					board.forwardDiagonals.push(space);
				}

				if (space.isBackDiagonal) {
					board.backwardDiagonals.push(space);
				}
			}

			board.spaces.push(columns);
		}

		this.setState({ board, size });
	};

	checkSpaces = (space, spaces: Space[]) => {
		const size = spaces.length;

		for (let i = 0; i < size; i++) {
			if (spaces[i].owner !== space.owner) {
				return false;
			}
		}

		for (let i = 0; i < size; i++) {
			spaces[i].isWinner = true;
		}

		this.setState({ winningPlayer: space.owner });

		return true;
	};

	checkWin = (space: Space, board: Board) => {
		const { row, col } = space;
		const rowSpaces = board.spaces[row];
		const colSpaces = board.spaces.map(spaces => spaces[col]);
		const forwardSpaces = board.forwardDiagonals;
		const backwardSpaces = board.backwardDiagonals;

		this.checkSpaces(space, rowSpaces);
		this.checkSpaces(space, colSpaces);
		this.checkSpaces(space, forwardSpaces);
		this.checkSpaces(space, backwardSpaces);
	};

	playSpace = (space: Space) => {
		const { currentPlayer } = this.state;
		const newPlayer = currentPlayer === Players.X ? Players.O : Players.X;
		const board = { ...(this.state.board as any) };

		space.owner = currentPlayer;

		board.moves += 1;
		board.spaces[space.row][space.col] = space;

		this.checkWin(space, board);

		this.setState({ currentPlayer: newPlayer, board });
	};

	render() {
		const { theme } = this.props;
		const { size, board, currentPlayer, winningPlayer } = this.state;
		const spaces = board ? (board as Board).spaces : [];
		const isCatsGame =
			(board && size ? (board as Board).moves === size * size : false) && !winningPlayer;

		return (
			<DocumentTitle title="Tic-Tac-Toe | BillBergquist.com">
				<Container style={{ padding: theme.rhythm(1) }} narrow>
					{!size && (
						<>
							<Row>
								<Column>
									<StyledTitle theme={theme} renderAs="h2">
										Please select a board size:
									</StyledTitle>
								</Column>
							</Row>

							<Row style={{ textAlign: "center" }}>
								{gameOptions.availableSizes.map(boardSize => (
									<StyledSizeColumn
										key={boardSize}
										theme={theme}
										onClick={() => this.buildBoard(boardSize)}
									>
										<Text renderAs="h3">{boardSize}</Text>
									</StyledSizeColumn>
								))}
							</Row>
						</>
					)}

					{!!spaces.length && (
						<>
							<Row>
								<Column>
									{!winningPlayer && !isCatsGame && (
										<StyledTitle theme={theme} renderAs="h2">
											Current player: <strong>{currentPlayer}</strong>
										</StyledTitle>
									)}

									{winningPlayer && (
										<StyledTitle theme={theme} renderAs="h2">
											Winning player: <strong>{winningPlayer}</strong>
										</StyledTitle>
									)}

									{isCatsGame && (
										<StyledTitle theme={theme} renderAs="h2">
											Cat's Game
										</StyledTitle>
									)}
								</Column>
							</Row>

							{spaces.map((columns, row) => (
								<Row key={row}>
									{columns.map((space, col) => (
										<StyledSpace
											theme={theme}
											key={col}
											onClick={() => !space.owner && !winningPlayer && this.playSpace(space)}
										>
											{space.isWinner ? `(${space.owner})` : space.owner}
										</StyledSpace>
									))}
								</Row>
							))}

							{(isCatsGame || winningPlayer) && (
								<Row style={{ marginTop: theme.rhythm(1) }}>
									<Column>
										<Button
											buttonStyle="primary"
											buttonSize="petite"
											label="Play Again"
											onClick={this.resetBoard}
										/>
									</Column>
								</Row>
							)}
						</>
					)}
				</Container>
			</DocumentTitle>
		);
	}
}

export default withTheme(TicTacToe);
