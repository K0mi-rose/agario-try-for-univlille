import ScoreboardHandler from "../../../common/Scoreboard/ScoreboardLoader";

describe('scoreboardHandlingOk', () => {

    const scoreboard = new ScoreboardHandler();

    it('should have a json attribute filled', () => {
        expect(scoreboard.json).not.toBeNull();
    })

})