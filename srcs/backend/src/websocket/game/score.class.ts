export class Score
{
	private score1: number = 0;
	private score2: number = 0;

	readonly winning_score: number;

	constructor(winning_score: number = 5)
	{
		if (winning_score == null || winning_score > 20)
			throw new RangeError('Score can not be more than 20');
		this.winning_score = winning_score;
	}

	player1()
	{
		if (this.score1 == this.winning_score || this.score2 == this.winning_score)
			throw new RangeError('A player already won!');
		console.log('player1');
		this.score1++;
	}

	player2()
	{
		if (this.score1 == this.winning_score || this.score2 == this.winning_score)
			throw new RangeError('A player already won!');
		console.log('player1');
		this.score2++;
	}

	getPlayer1()
	{
		return this.score1;
	}

	getPlayer2()
	{
		return this.score1;
	}

	winner(): number | null
	{
		if (this.score1 == this.winning_score)
			return 1;

		if (this.score2 == this.winning_score)
			return 2;

		return null;
	}
}